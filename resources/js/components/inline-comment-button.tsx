import { MessageSquare } from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import CommentSection from '@/components/comment-section';

interface InlineCommentButtonProps {
    documentId: number;
    sectionItemId: number;
    comments: any[];
    currentUser?: any;
    showResolve?: boolean;
}

export function InlineCommentButton({
    documentId,
    sectionItemId,
    comments,
    currentUser,
    showResolve,
}: InlineCommentButtonProps) {
    const { t } = useTranslation();
    const [showComments, setShowComments] = useState(false);

    if (!currentUser) {
        return null;
    }

    return (
        <div className="mt-4 pt-4 border-t space-y-4">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
                <MessageSquare className="w-4 h-4" />
                <span>
                    {comments.length} {comments.length === 1 ? t('common.comment') || 'Comment' : t('common.comments') || 'Comments'}
                </span>
            </Button>

            {showComments && (
                <CommentSection
                    documentId={documentId}
                    comments={comments}
                    currentUser={currentUser}
                    sectionItemId={sectionItemId}
                    isInline={true}
                    showResolve={showResolve}
                />
            )}
        </div>
    );
}


