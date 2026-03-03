import { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { ClipboardCheck, CheckCircle2, XCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const sampleQuiz = {
  title: "QCM – Sécurité Réseau",
  module: "Module 1 : Architecture interne",
  questions: [
    {
      id: 1,
      question: "Quel protocole est utilisé pour sécuriser les communications internes ?",
      options: ["HTTP", "TLS 1.3", "FTP", "SMTP"],
      correct: 1,
    },
    {
      id: 2,
      question: "Quelle est la première étape de la procédure d'escalade ?",
      options: [
        "Contacter le RSSI",
        "Documenter l'incident",
        "Isoler le système affecté",
        "Notifier les utilisateurs",
      ],
      correct: 2,
    },
    {
      id: 3,
      question: "Quel outil est recommandé pour le monitoring réseau ?",
      options: ["Excel", "Wireshark", "PowerPoint", "Slack"],
      correct: 1,
    },
    {
      id: 4,
      question: "Quelle est la durée maximale de rétention des logs ?",
      options: ["30 jours", "90 jours", "12 mois", "5 ans"],
      correct: 2,
    },
  ],
};

const Evaluations = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const q = sampleQuiz.questions[currentQuestion];
  const totalQuestions = sampleQuiz.questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const selectAnswer = (optionIdx: number) => {
    setAnswers({ ...answers, [currentQuestion]: optionIdx });
  };

  const next = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const score = Object.entries(answers).filter(
    ([qIdx, aIdx]) => sampleQuiz.questions[Number(qIdx)].correct === aIdx
  ).length;

  if (showResults) {
    return (
      <DashboardLayout>
        <div className="p-6 lg:p-8 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-8 text-center space-y-6"
          >
            <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center ${
              score >= totalQuestions * 0.7 ? "bg-success/10" : "bg-destructive/10"
            }`}>
              {score >= totalQuestions * 0.7 ? (
                <CheckCircle2 className="w-10 h-10 text-success" />
              ) : (
                <XCircle className="w-10 h-10 text-destructive" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              {score}/{totalQuestions}
            </h2>
            <p className="text-muted-foreground">
              {score >= totalQuestions * 0.7
                ? "Excellent ! Vous maîtrisez ce module."
                : "Des axes d'amélioration ont été identifiés."}
            </p>
            <div className="grid grid-cols-2 gap-3 pt-4">
              {sampleQuiz.questions.map((question, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg text-sm font-medium ${
                    answers[i] === question.correct
                      ? "bg-success/10 text-success"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  Q{i + 1}: {answers[i] === question.correct ? "Correct" : "Incorrect"}
                </div>
              ))}
            </div>
            <Button
              onClick={() => { setCurrentQuestion(0); setAnswers({}); setShowResults(false); }}
              className="gradient-primary text-primary-foreground mt-4"
            >
              Recommencer
            </Button>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-2xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-foreground">Évaluations</h1>
          <p className="text-muted-foreground mt-1">{sampleQuiz.title} — {sampleQuiz.module}</p>
        </motion.div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Question {currentQuestion + 1} / {totalQuestions}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card rounded-2xl p-6 space-y-5"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
              <ClipboardCheck className="w-5 h-5 text-primary-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground leading-snug">
              {q.question}
            </h2>
          </div>

          <div className="space-y-3">
            {q.options.map((option, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => selectAnswer(idx)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all text-sm font-medium ${
                  answers[currentQuestion] === idx
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-border hover:border-primary/30 text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="font-bold text-muted-foreground mr-2">
                  {String.fromCharCode(65 + idx)}.
                </span>
                {option}
              </motion.button>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={next}
              disabled={answers[currentQuestion] === undefined}
              className="gradient-primary text-primary-foreground gap-2"
            >
              {currentQuestion < totalQuestions - 1 ? "Suivant" : "Terminer"}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Evaluations;
