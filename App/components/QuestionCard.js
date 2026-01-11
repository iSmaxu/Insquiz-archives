import React from "react";
import ClassicQuestionCard from "./ClassicQuestionCard";
import LexicalQuestionCard from "./LexicalQuestionCard";

const QUESTION_RENDERERS = {
  lexical_matching: LexicalQuestionCard,
  classic: ClassicQuestionCard, // fallback explícito
};

export default function QuestionCard(props) {
  const { question } = props;
  if (!question) return null;

  const type = question.type || "classic";
  const Renderer =
    QUESTION_RENDERERS[type] || ClassicQuestionCard;

  return <Renderer {...props} />;
}
