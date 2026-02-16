'use client';

import React, { useState, useEffect } from 'react';
import AppShell from '@/components/layout/AppShell';
import { DraftControls } from '@/components/drafts/DraftControls';
import { DraftEditor } from '@/components/drafts/DraftEditor';
import { mockThreads, mockDraft } from '@/data/mockData';
import { EmailThreadV1 } from '@/types/dashboard';

export default function DraftsPage() {
    const [selectedThreadId, setSelectedThreadId] = useState<string>('');
    const [tone, setTone] = useState<string>('normal');
    const [instructions, setInstructions] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState<boolean>(false);

    const selectedThread = mockThreads.find((t: EmailThreadV1) => t.thread_id === selectedThreadId) || null;

    // Simulate streaming generation
    const handleGenerate = () => {
        setIsGenerating(true);
        setContent('');

        // Mock generation content based on selected thread
        let fullText = mockDraft.content;
        if (tone === 'brief') fullText = "Hi,\n\nApproved. Thanks.\n\nBest,\nUser";
        if (tone === 'formal') fullText = "Dear Sarah,\n\nI confirm receipt of the contract and approval of the terms within. We shall proceed accordingly.\n\nSincerely,\nUser";

        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex < fullText.length) {
                setContent(prev => prev + fullText[currentIndex]);
                currentIndex++;
            } else {
                clearInterval(interval);
                setIsGenerating(false);
            }
        }, 15); // Adjust speed of typing
    };

    // Reset when thread changes, or maybe keep it? Let's clear for now
    useEffect(() => {
        if (selectedThreadId) {
            setContent('');
        }
    }, [selectedThreadId]);

    return (
        <AppShell title="Draft Copilot">
            <div className="flex h-[calc(100vh-64px)] overflow-hidden">
                <DraftControls
                    selectedThreadId={selectedThreadId}
                    onThreadChange={setSelectedThreadId}
                    tone={tone}
                    onToneChange={setTone}
                    instructions={instructions}
                    onInstructionsChange={setInstructions}
                    isGenerating={isGenerating}
                    onGenerate={handleGenerate}
                />

                <div className="flex-1 overflow-hidden bg-paper">
                    {selectedThreadId ? (
                        <DraftEditor
                            content={content}
                            onUpdateContent={setContent}
                            originalThread={selectedThread}
                            isGenerating={isGenerating}
                            onRegenerate={handleGenerate}
                        />
                    ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground bg-paper-mid/30">
                            <div className="text-center">
                                <p className="text-lg font-medium text-ink">Ready to write?</p>
                                <p className="text-sm">Select an email thread from the left to get started.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppShell>
    );
}
