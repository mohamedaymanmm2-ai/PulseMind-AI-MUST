import React, { useState } from 'react';
import {
  AlertCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  Layers,
  Loader2,
  RotateCw,
  Shuffle,
  Trash2,
} from 'lucide-react';
import { FlashcardDeck, UserProfile } from '../types';
import { formatShortDate } from '../utils/academicMath';
import { useTranslation } from '../i18n/LanguageContext';
import { interpolate } from '../i18n/translations';
import { WorkspaceHeader } from './WorkspaceHeader';
import { postJsonWithRetry } from '../utils/apiFetch';

interface FlashcardsPageProps {
  profile: UserProfile;
  decks: FlashcardDeck[];
  onAddDeck: (deck: FlashcardDeck) => void;
  onDeleteDeck: (deckId: string) => void;
  onToggleCardMastered: (deckId: string, cardId: string) => void;
  onLogStudyMinutes: (minutes: number, subject: string, source: 'flashcards') => void;
  isSidebarOpenDesktop: boolean;
  onOpenSidebarDesktop: () => void;
  onOpenSidebarMobile: () => void;
}

const FOCUS_OPTIONS = [
  'Clinical Pharmacology',
  'Medical-Surgical Nursing',
  'NCLEX & OSCE High-Yield',
  'Foundations & Lab Values',
];

export const FlashcardsPage: React.FC<FlashcardsPageProps> = ({
  profile,
  decks,
  onAddDeck,
  onDeleteDeck,
  onToggleCardMastered,
  onLogStudyMinutes,
  isSidebarOpenDesktop,
  onOpenSidebarDesktop,
  onOpenSidebarMobile,
}) => {
  const { language, t } = useTranslation();
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(8);
  const [focus, setFocus] = useState(FOCUS_OPTIONS[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeDeckId, setActiveDeckId] = useState<string>(decks[0]?.id ?? '');
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyFilter, setStudyFilter] = useState<'all' | 'review'>('all');
  const [shuffledOrder, setShuffledOrder] = useState<string[] | null>(null);

  const activeDeck = decks.find((d) => d.id === activeDeckId) ?? decks[0] ?? null;

  const baseCards = activeDeck
    ? studyFilter === 'review'
      ? activeDeck.cards.filter((c) => !c.mastered)
      : activeDeck.cards
    : [];

  const displayCards =
    shuffledOrder && activeDeck
      ? shuffledOrder
          .map((id) => baseCards.find((c) => c.id === id))
          .filter((c): c is NonNullable<typeof c> => Boolean(c))
      : baseCards;

  const safeIndex = displayCards.length > 0 ? Math.min(cardIndex, displayCards.length - 1) : 0;
  const currentCard = displayCards[safeIndex] ?? null;

  const handleSelectDeck = (id: string) => {
    setActiveDeckId(id);
    setCardIndex(0);
    setIsFlipped(false);
    setShuffledOrder(null);
  };

  const handleShuffle = () => {
    if (!displayCards.length) return;
    const ids = displayCards.map((c) => c.id);
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    setShuffledOrder(ids);
    setCardIndex(0);
    setIsFlipped(false);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = topic.trim();
    if (!trimmed || isGenerating) return;

    setIsGenerating(true);
    setError(null);

    try {
      const data = await postJsonWithRetry<{
        title?: string;
        subject?: string;
        cards?: FlashcardDeck['cards'];
      }>('/api/generate/flashcards', {
        topic: trimmed,
        count,
        focus,
        profile,
        language,
      });

      if (!Array.isArray(data.cards) || data.cards.length === 0) {
        throw new Error('No flashcards were returned. Please try again.');
      }

      const subject = data.subject || focus;
      const newDeck: FlashcardDeck = {
        id: `deck-${Date.now()}`,
        title: data.title || trimmed.slice(0, 48),
        subject,
        createdAt: new Date().toISOString(),
        cards: data.cards,
      };

      onAddDeck(newDeck);
      onLogStudyMinutes(Math.max(5, data.cards.length * 2), subject, 'flashcards');
      setActiveDeckId(newDeck.id);
      setCardIndex(0);
      setIsFlipped(false);
      setStudyFilter('all');
      setShuffledOrder(null);
      setTopic('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to generate flashcards.');
    } finally {
      setIsGenerating(false);
    }
  };

  const masteredInDeck = activeDeck
    ? activeDeck.cards.filter((c) => c.mastered).length
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100">
      <WorkspaceHeader
        title={t.flashcards.title}
        subtitle={t.flashcards.subtitle}
        isSidebarOpenDesktop={isSidebarOpenDesktop}
        onOpenSidebarDesktop={onOpenSidebarDesktop}
        onOpenSidebarMobile={onOpenSidebarMobile}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Generator Form + Saved Decks */}
        <div className="lg:col-span-5 space-y-6">
          <form
            onSubmit={handleGenerate}
            className="p-6 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 space-y-4"
          >
            <div>
              <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-0.5">
                {t.flashcards.genKicker}
              </p>
              <h2 className="font-display text-base font-bold text-slate-900 dark:text-slate-50">
                {t.flashcards.genTitle}
              </h2>
            </div>

            <div>
              <label
                htmlFor="fc-topic"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                {t.flashcards.topicLabel}
              </label>
              <textarea
                id="fc-topic"
                rows={4}
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={t.flashcards.topicPlaceholder}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 resize-none"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {t.flashcards.presets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setTopic(preset)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer text-start"
                >
                  {preset}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="fc-focus"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  {t.flashcards.studyFocusLabel}
                </label>
                <select
                  id="fc-focus"
                  value={focus}
                  onChange={(e) => setFocus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                >
                  {FOCUS_OPTIONS.map((opt, idx) => (
                    <option key={opt} value={opt}>
                      {t.flashcards.focusOptions[idx] ?? opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="fc-count"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  {t.flashcards.cardCountLabel}
                </label>
                <select
                  id="fc-count"
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700 font-mono text-xs tabular-nums text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                >
                  {[5, 8, 12].map((num) => (
                    <option key={num} value={num}>
                      {num} {t.flashcards.cardsUnit}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={!topic.trim() || isGenerating}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t.flashcards.generatingBtn}</span>
                </>
              ) : (
                <>
                  <Layers className="w-4 h-4" />
                  <span>{t.flashcards.generateBtn}</span>
                </>
              )}
            </button>
          </form>

          {/* Saved Decks List */}
          <section className="p-6 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800">
            <div className="mb-4">
              <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-0.5">
                {t.flashcards.savedDecksKicker}
              </p>
              <h2 className="font-display text-base font-bold text-slate-900 dark:text-slate-50">
                {interpolate(t.flashcards.savedDecksTitle, { count: decks.length })}
              </h2>
            </div>

            {decks.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.flashcards.noDecksSaved}
              </p>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {decks.map((deck) => {
                  const isSelected = activeDeck?.id === deck.id;
                  const masteredCount = deck.cards.filter((c) => c.mastered).length;
                  return (
                    <div
                      key={deck.id}
                      className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0"
                    >
                      <button
                        type="button"
                        onClick={() => handleSelectDeck(deck.id)}
                        className="min-w-0 flex-1 text-start cursor-pointer group"
                      >
                        <p
                          className={`text-sm font-semibold truncate transition-colors ${
                            isSelected
                              ? 'text-blue-700 dark:text-blue-400'
                              : 'text-slate-900 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-400'
                          }`}
                        >
                          {deck.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 tabular-nums mt-0.5">
                          {deck.subject} · {masteredCount}/{deck.cards.length}{' '}
                          {t.flashcards.masteredSuffix} ·{' '}
                          {formatShortDate(deck.createdAt, language)}
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteDeck(deck.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer shrink-0"
                        aria-label={`${t.common.delete} ${deck.title}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Interactive Study Deck */}
        <div className="lg:col-span-7">
          {!activeDeck ? (
            <div className="p-12 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 text-center">
              <Layers className="w-8 h-8 text-slate-400 mx-auto mb-3" />
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50 mb-1">
                {t.flashcards.noDeckSelected}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                {t.flashcards.noDeckSelectedSub}
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Deck Header & Controls */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-0.5">
                    {activeDeck.subject}
                  </p>
                  <h2 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50">
                    {activeDeck.title}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">
                    {interpolate(t.flashcards.cardsMasteredOf, {
                      done: masteredInDeck,
                      total: activeDeck.cards.length,
                    })}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setStudyFilter('all');
                        setCardIndex(0);
                        setIsFlipped(false);
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                        studyFilter === 'all'
                          ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-xs'
                          : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {interpolate(t.flashcards.allFilter, { count: activeDeck.cards.length })}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setStudyFilter('review');
                        setCardIndex(0);
                        setIsFlipped(false);
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                        studyFilter === 'review'
                          ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-xs'
                          : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {interpolate(t.flashcards.needsReviewFilter, {
                        count: activeDeck.cards.length - masteredInDeck,
                      })}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleShuffle}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700 hover:border-blue-600 text-slate-700 dark:text-slate-200 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>{t.flashcards.shuffle}</span>
                  </button>
                </div>
              </div>

              {/* Active Card Stage */}
              {displayCards.length === 0 || !currentCard ? (
                <div className="p-10 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 text-center">
                  <Check className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
                  <h3 className="font-display text-base font-bold text-slate-900 dark:text-slate-50 mb-1">
                    {t.flashcards.allMasteredTitle}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                    {t.flashcards.allMasteredSub}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setStudyFilter('all');
                      setCardIndex(0);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 transition-colors cursor-pointer"
                  >
                    {t.flashcards.reviewAllCards}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => setIsFlipped((prev) => !prev)}
                    className="w-full min-h-[300px] p-7 sm:p-9 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 hover:border-blue-600 dark:hover:border-blue-500 transition-colors text-start flex flex-col justify-between cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs font-medium text-blue-700 dark:text-blue-400">
                        {isFlipped ? t.flashcards.answerPearlLabel : t.flashcards.promptLabel}
                      </span>
                      <span className="font-mono text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                        {interpolate(t.flashcards.cardOf, {
                          current: safeIndex + 1,
                          total: displayCards.length,
                        })}{' '}
                        · {currentCard.mastered ? t.flashcards.masteredState : t.flashcards.learningState}
                      </span>
                    </div>

                    <div className="py-6">
                      {!isFlipped ? (
                        <p className="font-display text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-50 leading-snug">
                          {currentCard.front}
                        </p>
                      ) : (
                        <div className="space-y-4">
                          <p className="text-base sm:text-lg font-medium text-slate-900 dark:text-slate-50 leading-relaxed">
                            {currentCard.back}
                          </p>
                          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                            <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">
                              {t.flashcards.bedsidePearlLabel}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                              {currentCard.clinicalPearl}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1.5">
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>
                          {isFlipped ? t.flashcards.flipToPrompt : t.flashcards.flipToAnswer}
                        </span>
                      </span>
                    </div>
                  </button>

                  {/* Card Navigation & Mastery Controls */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={safeIndex === 0}
                        onClick={() => {
                          setCardIndex((prev) => Math.max(0, prev - 1));
                          setIsFlipped(false);
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 disabled:opacity-40 text-slate-700 dark:text-slate-200 hover:border-blue-600 transition-colors cursor-pointer disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                        <span>{t.common.previous}</span>
                      </button>

                      <button
                        type="button"
                        disabled={safeIndex >= displayCards.length - 1}
                        onClick={() => {
                          setCardIndex((prev) => Math.min(displayCards.length - 1, prev + 1));
                          setIsFlipped(false);
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 disabled:opacity-40 text-slate-700 dark:text-slate-200 hover:border-blue-600 transition-colors cursor-pointer disabled:cursor-not-allowed"
                      >
                        <span>{t.common.next}</span>
                        <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onToggleCardMastered(activeDeck.id, currentCard.id)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                        currentCard.mastered
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>
                        {currentCard.mastered
                          ? t.flashcards.masteredUnmark
                          : t.flashcards.markMastered}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
