import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, RefreshCw, ExternalLink, Check, AlertTriangle } from 'lucide-react';
import { EmailThreadV1 } from '@/types/dashboard';

interface DraftEditorProps {
    content: string;
    onUpdateContent: (text: string) => void;
    originalThread: EmailThreadV1 | null;
    isGenerating: boolean;
    onRegenerate: () => void;
}

export function DraftEditor({
    content,
    onUpdateContent,
    originalThread,
    isGenerating,
    onRegenerate
}: DraftEditorProps) {
    const [copied, setCopied] = React.useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [content]);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const recipient = originalThread ? originalThread.participants.find(p => p !== 'you@company.com') || 'Recipient' : 'Recipient';
    const subject = originalThread ? `Re: ${originalThread.subject}` : 'Subject';

    const placeholders = (content.match(/\[.*?\]/g) || []).length;

    return (
        <div className="flex flex-col h-full bg-paper relative">
            {/* Header / Meta */}
            <div className="px-8 py-6 border-b border-border-light bg-surface-card/50">
                <div className="grid gap-4 max-w-3xl mx-auto">
                    <div className="grid grid-cols-[80px_1fr] items-center gap-4">
                        <span className="text-sm font-medium text-ink-light text-right">To:</span>
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="font-mono font-normal">
                                {recipient}
                            </Badge>
                        </div>
                    </div>
                    <div className="grid grid-cols-[80px_1fr] items-center gap-4">
                        <span className="text-sm font-medium text-ink-light text-right">Subject:</span>
                        <span className="text-sm font-medium text-ink">{subject}</span>
                    </div>
                </div>
            </div>

            {/* Editor Area */}
            <ScrollArea className="flex-1">
                <div className="px-8 py-8 max-w-3xl mx-auto">
                    {isGenerating ? (
                        <div className="space-y-4 animate-pulse">
                            <div className="h-4 bg-paper-mid rounded w-3/4"></div>
                            <div className="h-4 bg-paper-mid rounded w-full"></div>
                            <div className="h-4 bg-paper-mid rounded w-5/6"></div>
                        </div>
                    ) : content ? (
                        <Textarea
                            ref={textareaRef}
                            value={content}
                            onChange={(e) => onUpdateContent(e.target.value)}
                            className="min-h-[400px] border-none shadow-none focus-visible:ring-0 p-0 text-base leading-relaxed resize-none bg-transparent"
                            placeholder="Draft will appear here..."
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border-2 border-dashed border-border-light rounded-xl bg-paper-mid/30">
                            <p>Select a thread and click Generate to start.</p>
                        </div>
                    )}
                </div>
            </ScrollArea>

            {/* Action Bar */}
            <div className="border-t border-border-light bg-surface-card p-4">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {placeholders > 0 && (
                            <div className="flex items-center gap-2 text-warning text-xs font-medium bg-warning/10 px-2 py-1 rounded-full">
                                <AlertTriangle className="h-3 w-3" />
                                {placeholders} placeholder{placeholders !== 1 ? 's' : ''} detected
                            </div>
                        )}
                        <Button variant="ghost" size="sm" onClick={onRegenerate} disabled={!content || isGenerating}>
                            <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                            Regenerate
                        </Button>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handleCopy} disabled={!content}>
                            {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                            {copied ? 'Copied' : 'Copy Text'}
                        </Button>
                        <Button variant="default" size="sm" className="bg-accent hover:bg-accent-hover text-white" disabled={!content}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open in Gmail
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
