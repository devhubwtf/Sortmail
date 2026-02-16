import React from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Sparkles, Mail } from 'lucide-react';
import { mockThreads } from '@/data/mockData';
import { EmailThreadV1 } from '@/types/dashboard';

interface DraftControlsProps {
    selectedThreadId: string;
    onThreadChange: (threadId: string) => void;
    tone: string;
    onToneChange: (tone: string) => void;
    instructions: string;
    onInstructionsChange: (text: string) => void;
    isGenerating: boolean;
    onGenerate: () => void;
}

export function DraftControls({
    selectedThreadId,
    onThreadChange,
    tone,
    onToneChange,
    instructions,
    onInstructionsChange,
    isGenerating,
    onGenerate
}: DraftControlsProps) {
    return (
        <div className="flex flex-col gap-6 p-6 h-full border-r border-border-light bg-surface-card w-full md:w-[400px] shrink-0 overflow-y-auto">
            <div>
                <h2 className="font-display text-xl text-ink">Draft Copilot</h2>
                <p className="text-sm text-ink-light mt-1">AI-powered email replies</p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label>Select Thread</Label>
                    <Select value={selectedThreadId} onValueChange={onThreadChange}>
                        <SelectTrigger className="w-full bg-paper">
                            <SelectValue placeholder="Choose an email to reply to..." />
                        </SelectTrigger>
                        <SelectContent>
                            {mockThreads.map((thread: EmailThreadV1) => (
                                <SelectItem key={thread.thread_id} value={thread.thread_id}>
                                    <span className="truncate block max-w-[300px]">{thread.subject}</span>
                                    <span className="block text-xs text-muted-foreground truncate max-w-[300px]">
                                        {thread.participants[0]}
                                    </span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-3">
                    <Label>Tone</Label>
                    <RadioGroup value={tone} onValueChange={onToneChange} className="flex flex-col space-y-1">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="brief" id="brief" />
                            <Label htmlFor="brief" className="font-normal text-ink-light">Brief & Direct</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="normal" id="normal" />
                            <Label htmlFor="normal" className="font-normal text-ink-light">Professional (Default)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="formal" id="formal" />
                            <Label htmlFor="formal" className="font-normal text-ink-light">Formal & Polished</Label>
                        </div>
                    </RadioGroup>
                </div>

                <div className="space-y-2">
                    <Label>Custom Instructions (Optional)</Label>
                    <Textarea
                        placeholder="e.g., Mention that I'm out of office until Thursday..."
                        className="bg-paper min-h-[100px] text-sm resize-none"
                        value={instructions}
                        onChange={(e) => onInstructionsChange(e.target.value)}
                    />
                </div>

                <Button
                    className="w-full gap-2 bg-ai hover:bg-ai/90 text-white shadow-md shadow-ai/20 transition-all font-medium py-6"
                    onClick={onGenerate}
                    disabled={!selectedThreadId || isGenerating}
                >
                    {isGenerating ? (
                        <>
                            <Sparkles className="h-5 w-5 animate-spin" />
                            Drafting...
                        </>
                    ) : (
                        <>
                            <Sparkles className="h-5 w-5" />
                            Generate Draft
                        </>
                    )}
                </Button>
            </div>

            <div className="mt-auto pt-6 border-t border-border-light">
                <div className="bg-paper-mid/50 rounded-lg p-3 text-xs text-ink-light flex gap-2 border border-border-light">
                    <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <p>Drafts are saved automatically. You can edit them before sending.</p>
                </div>
            </div>
        </div>
    );
}
