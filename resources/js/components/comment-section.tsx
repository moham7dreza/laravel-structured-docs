import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { MessageSquare, Send, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { RichTextEditor } from '@/components/rich-text-editor';

interface User {
    id: number;
    name: string;
    avatar?: string;
}

interface Reply {
    id: number;
    content: string;
    created_at: string;
    user: User;
}

interface Comment {
    id: number;
    content: string;
    created_at: string;
    updated_at: string;
    is_resolved?: boolean;
    resolved_at?: string;
    user: User;
    replies?: Reply[];
    mentions?: string[];
}

interface CommentSectionProps {
    documentId: number;
    comments: Comment[];
    currentUser?: User;
    sectionItemId?: number;
    isInline?: boolean;
    showResolve?: boolean;
}

export default function CommentSection({
    documentId,
    comments,
    currentUser,
    sectionItemId,
    isInline = false,
    showResolve = false,
}: CommentSectionProps) {
    const [showCommentForm, setShowCommentForm] = useState(false);
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [editingComment, setEditingComment] = useState<number | null>(null);

    const commentForm = useForm({
        document_id: documentId,
        parent_id: null as number | null,
        section_item_id: sectionItemId || null,
        content: '',
    });

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (seconds < 60) return 'just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    const handleSubmitComment = (e: React.FormEvent) => {
        e.preventDefault();
        commentForm.post('/comments', {
            preserveScroll: true,
            onSuccess: () => {
                commentForm.reset('content');
                setShowCommentForm(false);
                setReplyingTo(null);
            },
        });
    };

    const handleSubmitReply = (parentId: number, content: string) => {
        useForm({
            document_id: documentId,
            parent_id: parentId,
            section_item_id: sectionItemId || null,
            content: content,
        }).post('/comments', {
            preserveScroll: true,
            onSuccess: () => {
                setReplyingTo(null);
            },
        });
    };

    const handleUpdateComment = (commentId: number, content: string) => {
        useForm({ content }).put(`/comments/${commentId}`, {
            preserveScroll: true,
            onSuccess: () => {
                setEditingComment(null);
            },
        });
    };

    const handleDeleteComment = (commentId: number) => {
        if (confirm('Are you sure you want to delete this comment?')) {
            useForm({}).delete(`/comments/${commentId}`, {
                preserveScroll: true,
            });
        }
    };

    const handleResolveComment = (commentId: number) => {
        useForm({}).post(`/comments/${commentId}/resolve`, {
            preserveScroll: true,
        });
    };

    const handleUnresolveComment = (commentId: number) => {
        useForm({}).post(`/comments/${commentId}/unresolve`, {
            preserveScroll: true,
        });
    };

    return (
        <div className={`space-y-4 ${isInline ? 'bg-muted/30 p-4 rounded-lg' : ''}`}>
            {!isInline && (
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        Comments ({comments.length})
                    </h3>
                    {currentUser && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowCommentForm(!showCommentForm)}
                        >
                            {showCommentForm ? 'Cancel' : 'Add Comment'}
                        </Button>
                    )}
                </div>
            )}

            {/* Comment Form */}
            {currentUser && (showCommentForm || isInline) && (
                <Card className="p-4">
                    <form onSubmit={handleSubmitComment} className="space-y-4">
                        <div className="flex items-start gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                                <AvatarFallback className="text-xs bg-brand-500 text-white">
                                    {getInitials(currentUser.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <RichTextEditor
                                    value={commentForm.data.content}
                                    onChange={(value) => commentForm.setData('content', value)}
                                    placeholder="Write a comment... Use @username to mention someone"
                                    minHeight="120px"
                                />
                                {commentForm.errors.content && (
                                    <p className="text-sm text-destructive mt-1">{commentForm.errors.content}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            {!isInline && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowCommentForm(false)}
                                >
                                    Cancel
                                </Button>
                            )}
                            <Button type="submit" size="sm" disabled={commentForm.processing || !commentForm.data.content}>
                                <Send className="w-4 h-4 mr-2" />
                                {commentForm.processing ? 'Posting...' : 'Post Comment'}
                            </Button>
                        </div>
                    </form>
                </Card>
            )}

            {/* Comments List */}
            <div className="space-y-4">
                {comments.map((comment) => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        currentUser={currentUser}
                        showResolve={showResolve}
                        onReply={(content) => handleSubmitReply(comment.id, content)}
                        onEdit={(content) => handleUpdateComment(comment.id, content)}
                        onDelete={() => handleDeleteComment(comment.id)}
                        onResolve={() => handleResolveComment(comment.id)}
                        onUnresolve={() => handleUnresolveComment(comment.id)}
                    />
                ))}
            </div>

            {comments.length === 0 && !showCommentForm && !isInline && (
                <Card className="p-8 text-center">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
                </Card>
            )}
        </div>
    );
}

interface CommentItemProps {
    comment: Comment;
    currentUser?: User;
    showResolve?: boolean;
    onReply: (content: string) => void;
    onEdit: (content: string) => void;
    onDelete: () => void;
    onResolve: () => void;
    onUnresolve: () => void;
}

function CommentItem({
    comment,
    currentUser,
    showResolve,
    onReply,
    onEdit,
    onDelete,
    onResolve,
    onUnresolve,
}: CommentItemProps) {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [editContent, setEditContent] = useState(comment.content);

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (seconds < 60) return 'just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    const handleSubmitReply = (e: React.FormEvent) => {
        e.preventDefault();
        onReply(replyContent);
        setReplyContent('');
        setShowReplyForm(false);
    };

    const handleSubmitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        onEdit(editContent);
        setIsEditing(false);
    };

    return (
        <Card className={`p-4 ${comment.is_resolved ? 'opacity-60' : ''}`}>
            <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                    <AvatarFallback className="bg-brand-500 text-white">
                        {getInitials(comment.user.name)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{comment.user.name}</span>
                        <span className="text-sm text-muted-foreground">{formatDate(comment.created_at)}</span>
                        {comment.is_resolved && (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Resolved
                            </Badge>
                        )}
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleSubmitEdit} className="space-y-2 mt-2">
                            <RichTextEditor
                                value={editContent}
                                onChange={setEditContent}
                                placeholder="Edit your comment..."
                                minHeight="100px"
                            />
                            <div className="flex gap-2">
                                <Button type="submit" size="sm">
                                    Save
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditContent(comment.content);
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <div
                            className="prose prose-sm dark:prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: comment.content }}
                        />
                    )}

                    {/* Actions */}
                    {!isEditing && (
                        <div className="flex items-center gap-3 mt-2">
                            {currentUser && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowReplyForm(!showReplyForm)}
                                    className="h-7 px-2 text-xs"
                                >
                                    Reply
                                </Button>
                            )}
                            {currentUser?.id === comment.user.id && (
                                <>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIsEditing(true)}
                                        className="h-7 px-2 text-xs"
                                    >
                                        <Edit2 className="w-3 h-3 mr-1" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={onDelete}
                                        className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="w-3 h-3 mr-1" />
                                        Delete
                                    </Button>
                                </>
                            )}
                            {showResolve && !comment.is_resolved && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onResolve}
                                    className="h-7 px-2 text-xs text-green-600 hover:text-green-700"
                                >
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Resolve
                                </Button>
                            )}
                            {showResolve && comment.is_resolved && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onUnresolve}
                                    className="h-7 px-2 text-xs"
                                >
                                    <XCircle className="w-3 h-3 mr-1" />
                                    Unresolve
                                </Button>
                            )}
                        </div>
                    )}

                    {/* Reply Form */}
                    {showReplyForm && currentUser && (
                        <form onSubmit={handleSubmitReply} className="mt-3 space-y-2">
                            <div className="flex items-start gap-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                                    <AvatarFallback className="text-xs bg-brand-500 text-white">
                                        {getInitials(currentUser.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <RichTextEditor
                                        value={replyContent}
                                        onChange={setReplyContent}
                                        placeholder="Write a reply..."
                                        minHeight="80px"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" size="sm" disabled={!replyContent}>
                                    <Send className="w-3 h-3 mr-1" />
                                    Reply
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setShowReplyForm(false);
                                        setReplyContent('');
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    )}

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-4 space-y-3 pl-4 border-l-2 border-muted">
                            {comment.replies.map((reply) => (
                                <div key={reply.id} className="flex items-start gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={reply.user.avatar} alt={reply.user.name} />
                                        <AvatarFallback className="text-xs bg-brand-500 text-white">
                                            {getInitials(reply.user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-sm">{reply.user.name}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {formatDate(reply.created_at)}
                                            </span>
                                        </div>
                                        <div
                                            className="prose prose-sm dark:prose-invert max-w-none text-sm"
                                            dangerouslySetInnerHTML={{ __html: reply.content }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}
