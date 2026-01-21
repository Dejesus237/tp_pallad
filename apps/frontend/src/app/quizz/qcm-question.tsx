import { ChangeEventHandler, useState } from 'react';

type QcmQuestionProps = {
    id: string;
    question: string;
    answerA: string;
    answerB: string;
    answerC: string;
    answerD: string;
    changeFunction: ChangeEventHandler<HTMLInputElement>;
    formData: string;
}

export default function QcmQuestion({
    id,
    question,
    answerA,
    answerB,
    answerC,
    answerD,
    changeFunction,
    formData,
}: QcmQuestionProps) {
    return (
        <div className="p-4 border border-slate-600 rounded-xl bg-slate-800">
            <label className="block text-lg font-medium text-slate-300 mb-4">
                <span className='text-xl text-blue-300 font-bold mr-2'>Q{id}</span>
                {question}
            </label>
            <div className="space-y-2">
                {['a', 'b', 'c', 'd'].map((opt) => (
                    <label key={opt}
                        className="flex items-center space-x-3 p-3 text-slate-200 rounded-lg bg-slate-700/50 hover:bg-slate-700 cursor-pointer">
                        <input
                            type="radio"
                            name={`q${id}`}
                            value={opt}
                            checked={formData === opt}
                            onChange={changeFunction}
                            className="text-blue-500" />
                        <span>
                            {opt === 'a' && answerA}
                            {opt === 'b' && answerB}
                            {opt === 'c' && answerC}
                            {opt === 'd' && answerD}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    );
}