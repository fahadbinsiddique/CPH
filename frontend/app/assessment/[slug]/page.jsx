'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Loader2,
  Clock, ClipboardList, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { assessmentService } from '@/services/assessmentService';
import useAuthStore from '@/store/authStore';

export default function QuizPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    assessmentService.getBySlug(slug)
      .then(res => setQuiz(res.data))
      .catch(() => router.push('/assessment'))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAnswer = (questionId, optionId) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    setSubmitting(true);
    try {
      const res = await assessmentService.submit({
        quiz_id: quiz.id,
        answers,
      });
      router.push(`/assessment/result/${res.data.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );

  if (!quiz) return null;

  const questions = quiz.questions || [];
  const totalQ = questions.length;
  const progress = totalQ > 0 ? ((currentQ) / totalQ) * 100 : 0;
  const currentQuestion = questions[currentQ];
  const answeredCount = Object.keys(answers).length;
  const isLastQ = currentQ === totalQ - 1;
  const canProceed = answers[currentQuestion?.id] !== undefined;

  // Intro screen
  if (!started) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full"
        >
          <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-8 text-center text-white">
              <span className="text-6xl block mb-3">{quiz.icon}</span>
              <h1 className="text-2xl font-bold mb-1">{quiz.title}</h1>
              <p className="text-blue-100 text-sm">{quiz.description}</p>
            </div>

            <CardContent className="p-6">
              <div className="flex justify-around text-center mb-6 py-4 bg-slate-50 rounded-xl">
                <div>
                  <p className="text-2xl font-bold text-slate-800">{totalQ}</p>
                  <p className="text-xs text-slate-400">Questions</p>
                </div>
                <div className="border-x border-slate-200 px-6">
                  <p className="text-2xl font-bold text-slate-800">{quiz.duration_minutes}</p>
                  <p className="text-xs text-slate-400">Minutes</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">Free</p>
                  <p className="text-xs text-slate-400">No cost</p>
                </div>
              </div>

              {quiz.instructions && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-5 text-sm text-blue-700">
                  <p className="font-medium mb-1">Instructions</p>
                  <p>{quiz.instructions}</p>
                </div>
              )}

              <Button
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                onClick={() => setStarted(true)}
              >
                Start Assessment
              </Button>

              <p className="text-center text-xs text-slate-400 mt-3">
                Your responses are confidential
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top progress bar */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-white border-b border-slate-100">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
            <span className="font-medium text-slate-700">{quiz.title}</span>
            <span>{currentQ + 1} / {totalQ}</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQ + 1) / totalQ) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="max-w-2xl mx-auto px-4 pt-24 pb-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            <Card className="border-0 shadow-md rounded-2xl">
              <CardContent className="p-6 sm:p-8">
                {/* Question number */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-semibold flex items-center justify-center flex-shrink-0">
                    {currentQ + 1}
                  </span>
                  <span className="text-xs text-slate-400">of {totalQ}</span>
                </div>

                {/* Question text */}
                <h2 className="text-lg font-semibold text-slate-800 mb-6 leading-snug">
                  {currentQuestion?.text}
                </h2>

                {/* Options */}
                <div className="space-y-3">
                  {currentQuestion?.options.map((option) => {
                    const isSelected = answers[currentQuestion.id] === option.id;
                    return (
                      <motion.button
                        key={option.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAnswer(currentQuestion.id, option.id)}
                        className={`
                          w-full text-left px-4 py-3.5 rounded-xl border-2
                          transition-all duration-150 text-sm font-medium
                          ${isSelected
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-slate-50'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`
                            w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center
                            ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}
                          `}>
                            {isSelected && (
                              <span className="w-2 h-2 rounded-full bg-white" />
                            )}
                          </span>
                          {option.text}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-5">
          <Button
            variant="outline"
            onClick={() => setCurrentQ(q => q - 1)}
            disabled={currentQ === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
          </Button>

          {isLastQ ? (
            <Button
              className="bg-green-600 hover:bg-green-700 text-white px-6"
              disabled={!canProceed || submitting || answeredCount < totalQ}
              onClick={handleSubmit}
            >
              {submitting
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
                : <><CheckCircle2 className="w-4 h-4 mr-2" /> Submit</>
              }
            </Button>
          ) : (
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!canProceed}
              onClick={() => setCurrentQ(q => q + 1)}
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>

        {/* Answered count */}
        <p className="text-center text-xs text-slate-400 mt-4">
          {answeredCount} of {totalQ} answered
        </p>
      </div>
    </div>
  );
}