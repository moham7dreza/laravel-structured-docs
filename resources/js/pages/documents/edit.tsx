import { Head, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Send, Loader2, X, Plus, Trash2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { RichTextEditor } from '@/components/rich-text-editor';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

interface Category {
    id: number;
    name: string;
    slug: string;
    icon: string | null;
    color: string | null;
}

interface Tag {
    id: number;
    name: string;
    slug: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
}

interface Structure {
    id: number;
    title: string;
    description: string | null;
    version: string;
    is_default: boolean;
    sections: StructureSection[];
}

interface StructureSection {
    id: number;
    title: string;
    description: string | null;
    position: number;
    items: StructureSectionItem[];
}

interface StructureSectionItem {
    id: number;
    type: string;
    label: string;
    description: string | null;
    placeholder: string | null;
    is_required: boolean;
    default_value: string | null;
    position: number;
}

interface Branch {
    task_id: string;
    task_title: string;
    branch_name: string;
    repository_url: string;
    merged_at: string | null;
}

interface Editor {
    user_id: number | null;
    access_type: 'full' | 'limited';
    can_manage_editors: boolean;
    sections: number[];
}

interface Reviewer {
    user_id: number | null;
    status: 'pending' | 'in_progress' | 'approved' | 'rejected';
}

interface Reference {
    target_document_id: number | null;
    context: string;
}

interface Link {
    title: string;
    url: string;
    description: string;
}

interface DocumentCreateProps {
    categories: Category[];
    tags: Tag[];
    users: User[];
}

export default function DocumentEdit({ document, categories, tags, users }: DocumentEditProps) {
    const [selectedCategory, setSelectedCategory] = useState<number | null>(document.category_id);
    const [structures, setStructures] = useState<Structure[]>([]);
    const [selectedStructure, setSelectedStructure] = useState<Structure | null>(null);
    const [loadingStructures, setLoadingStructures] = useState(false);
    const [selectedTags, setSelectedTags] = useState<number[]>(document.tags);
    const [currentTab, setCurrentTab] = useState('basic');

    const { data, setData, put, processing, errors } = useForm({
        // Basic Information
        title: document.title,
        description: document.description || '',
        image: document.image || '',
        tags: document.tags,

        // Structure & Category
        category_id: document.category_id.toString(),
        structure_id: document.structure_id.toString(),
        content_data: document.content_data,

        // Branch Information
        branches: document.branches,

        // Permissions
        editors: document.editors,
        reviewers: document.reviewers,

        // References & Links
        references: document.references,
        links: document.links,

        // Settings
        watchers: document.watchers,
        visibility: document.visibility,
        status: document.status,
        approval_status: document.approval_status,
    });

    // Load structures when category is selected
    useEffect(() => {
        if (selectedCategory) {
            setLoadingStructures(true);
            fetch(`/api/structures/by-category?category_id=${selectedCategory}`)
                .then((res) => res.json())
                .then((data) => {
                    setStructures(data);
                    // Find and set the current structure
                    const currentStructure = data.find((s: Structure) => s.id === document.structure_id);
                    if (currentStructure) {
                        setSelectedStructure(currentStructure);
                    }
                    setLoadingStructures(false);
                })
                .catch(() => setLoadingStructures(false));
        } else {
            setStructures([]);
            setSelectedStructure(null);
        }
    }, [selectedCategory]);

    // Initialize content data when structure is selected (only for new structures)
    useEffect(() => {
        if (selectedStructure && !document.content_data) {
            const contentData: Record<string, string> = {};
            selectedStructure.sections.forEach((section) => {
                section.items.forEach((item) => {
                    const key = `section_${section.id}_item_${item.id}`;
                    contentData[key] = item.default_value || '';
                });
            });
            setData('content_data', contentData);
        }
    }, [selectedStructure]);

    const handleCategoryChange = (categoryId: string) => {
        setSelectedCategory(parseInt(categoryId));
        setData('category_id', categoryId);
        setSelectedStructure(null);
        setData('structure_id', '');
    };

    const handleStructureChange = (structureId: string) => {
        const structure = structures.find((s) => s.id === parseInt(structureId));
        setSelectedStructure(structure || null);
        setData('structure_id', structureId);
    };

    const handleContentChange = (key: string, value: string) => {
        setData('content_data', {
            ...data.content_data,
            [key]: value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/documents/${document.slug}`, {
            preserveScroll: true,
        });
    };

    // Helper functions for managing arrays
    const addBranch = () => {
        setData('branches', [...data.branches, {
            task_id: '',
            task_title: '',
            branch_name: '',
            repository_url: '',
            merged_at: null,
        }]);
    };

    const removeBranch = (index: number) => {
        setData('branches', data.branches.filter((_, i) => i !== index));
    };

    const updateBranch = (index: number, field: keyof Branch, value: any) => {
        const newBranches = [...data.branches];
        newBranches[index] = { ...newBranches[index], [field]: value };
        setData('branches', newBranches);
    };

    const addEditor = () => {
        setData('editors', [...data.editors, {
            user_id: null,
            access_type: 'full',
            can_manage_editors: false,
            sections: [],
        }]);
    };

    const removeEditor = (index: number) => {
        setData('editors', data.editors.filter((_, i) => i !== index));
    };

    const updateEditor = (index: number, field: keyof Editor, value: any) => {
        const newEditors = [...data.editors];
        newEditors[index] = { ...newEditors[index], [field]: value };
        setData('editors', newEditors);
    };

    const addReviewer = () => {
        setData('reviewers', [...data.reviewers, {
            user_id: null,
            status: 'pending',
        }]);
    };

    const removeReviewer = (index: number) => {
        setData('reviewers', data.reviewers.filter((_, i) => i !== index));
    };

    const updateReviewer = (index: number, field: keyof Reviewer, value: any) => {
        const newReviewers = [...data.reviewers];
        newReviewers[index] = { ...newReviewers[index], [field]: value };
        setData('reviewers', newReviewers);
    };

    const addReference = () => {
        setData('references', [...data.references, {
            target_document_id: null,
            context: '',
        }]);
    };

    const removeReference = (index: number) => {
        setData('references', data.references.filter((_, i) => i !== index));
    };

    const updateReference = (index: number, field: keyof Reference, value: any) => {
        const newReferences = [...data.references];
        newReferences[index] = { ...newReferences[index], [field]: value };
        setData('references', newReferences);
    };

    const addLink = () => {
        setData('links', [...data.links, {
            title: '',
            url: '',
            description: '',
        }]);
    };

    const removeLink = (index: number) => {
        setData('links', data.links.filter((_, i) => i !== index));
    };

    const updateLink = (index: number, field: keyof Link, value: any) => {
        const newLinks = [...data.links];
        newLinks[index] = { ...newLinks[index], [field]: value };
        setData('links', newLinks);
    };

    const canSubmit = data.title && data.category_id && data.structure_id;

    return (
        <>
            <Head title={`Edit: ${document.title}`} />

            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
                <div className="container mx-auto flex h-14 items-center justify-between px-4">
                    <Button variant="ghost" size="sm" asChild>
                        <a href={`/documents/${document.slug}`} className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Document
                        </a>
                    </Button>
                    <h1 className="font-semibold">Edit Document</h1>
                    <div className="w-32" /> {/* Spacer for centering */}
                </div>
            </header>

            <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
                <div className="container mx-auto px-4 py-8 max-w-6xl">
                    <form onSubmit={handleSubmit}>
                        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-6 mb-8">
                                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                                <TabsTrigger value="structure">Structure</TabsTrigger>
                                <TabsTrigger value="branch">Branches</TabsTrigger>
                                <TabsTrigger value="permissions">Permissions</TabsTrigger>
                                <TabsTrigger value="references">References</TabsTrigger>
                                <TabsTrigger value="settings">Settings</TabsTrigger>
                            </TabsList>

                            {/* TAB 1: Basic Information */}
                            <TabsContent value="basic">
                                <Card className="p-6">
                                    <h2 className="text-2xl font-bold mb-6">Basic Information</h2>

                                    {/* Title */}
                                    <div className="mb-6">
                                        <Label htmlFor="title">
                                            Document Title <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="title"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            placeholder="Enter document title..."
                                            className="mt-2"
                                        />
                                        {errors.title && (
                                            <p className="text-sm text-destructive mt-1">{errors.title}</p>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div className="mb-6">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Brief description of the document..."
                                            rows={4}
                                            className="mt-2"
                                        />
                                    </div>

                                    {/* Image URL */}
                                    <div className="mb-6">
                                        <Label htmlFor="image">Cover Image URL</Label>
                                        <Input
                                            id="image"
                                            type="url"
                                            value={data.image}
                                            onChange={(e) => setData('image', e.target.value)}
                                            placeholder="https://example.com/image.jpg"
                                            className="mt-2"
                                        />
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Optional: Provide a URL for the document cover image
                                        </p>
                                    </div>

                                    {/* Tags */}
                                    <div className="mb-6">
                                        <Label>Tags</Label>
                                        <p className="text-sm text-muted-foreground mt-1 mb-3">
                                            Select tags to categorize this document
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {tags.map((tag) => (
                                                <Badge
                                                    key={tag.id}
                                                    variant={selectedTags.includes(tag.id) ? 'default' : 'outline'}
                                                    className="cursor-pointer"
                                                    onClick={() => {
                                                        const newTags = selectedTags.includes(tag.id)
                                                            ? selectedTags.filter((id) => id !== tag.id)
                                                            : [...selectedTags, tag.id];
                                                        setSelectedTags(newTags);
                                                        setData('tags', newTags);
                                                    }}
                                                >
                                                    {tag.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <Button
                                            type="button"
                                            onClick={() => setCurrentTab('structure')}
                                            disabled={!data.title}
                                        >
                                            Next: Structure & Content
                                        </Button>
                                    </div>
                                </Card>
                            </TabsContent>

                            {/* TAB 2: Structure & Category */}
                            <TabsContent value="structure">
                                <Card className="p-6">
                                    <h2 className="text-2xl font-bold mb-6">Structure & Category</h2>

                                    {/* Category */}
                                    <div className="mb-6">
                                        <Label htmlFor="category">
                                            Category <span className="text-destructive">*</span>
                                        </Label>
                                        <Select value={data.category_id} onValueChange={handleCategoryChange}>
                                            <SelectTrigger className="mt-2">
                                                <SelectValue placeholder="Select a category..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((cat) => (
                                                    <SelectItem key={cat.id} value={cat.id.toString()}>
                                                        {cat.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.category_id && (
                                            <p className="text-sm text-destructive mt-1">{errors.category_id}</p>
                                        )}
                                    </div>

                                    {/* Structure Template */}
                                    {selectedCategory && (
                                        <div className="mb-6">
                                            <Label htmlFor="structure">
                                                Document Structure <span className="text-destructive">*</span>
                                            </Label>
                                            <p className="text-sm text-muted-foreground mt-1 mb-2">
                                                Select a structure template. Default structure is recommended.
                                            </p>
                                            {loadingStructures ? (
                                                <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    Loading structures...
                                                </div>
                                            ) : structures.length > 0 ? (
                                                <Select value={data.structure_id} onValueChange={handleStructureChange}>
                                                    <SelectTrigger className="mt-2">
                                                        <SelectValue placeholder="Select a structure template..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {structures.map((struct) => (
                                                            <SelectItem key={struct.id} value={struct.id.toString()}>
                                                                {struct.title}
                                                                {struct.is_default && ' (Default)'}
                                                                {' - v' + struct.version}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <p className="mt-2 text-sm text-muted-foreground">
                                                    No structures available for this category.
                                                </p>
                                            )}
                                            {errors.structure_id && (
                                                <p className="text-sm text-destructive mt-1">{errors.structure_id}</p>
                                            )}
                                        </div>
                                    )}

                                    {/* Document Content */}
                                    {selectedStructure && (
                                        <div className="mt-8">
                                            <h3 className="text-xl font-semibold mb-4">Document Content</h3>
                                            <p className="text-sm text-muted-foreground mb-6">
                                                Fill in the content based on the selected structure
                                            </p>

                                            {selectedStructure.sections.map((section) => (
                                                <Card key={section.id} className="p-6 mb-6">
                                                    <h4 className="text-lg font-semibold mb-2">{section.title}</h4>
                                                    {section.description && (
                                                        <p className="text-sm text-muted-foreground mb-4">
                                                            {section.description}
                                                        </p>
                                                    )}

                                                    <div className="space-y-4">
                                                        {section.items.map((item) => {
                                                            const key = `section_${section.id}_item_${item.id}`;
                                                            return (
                                                                <div key={item.id}>
                                                                    <Label htmlFor={key}>
                                                                        {item.label}
                                                                        {item.is_required && (
                                                                            <span className="text-destructive ml-1">*</span>
                                                                        )}
                                                                    </Label>
                                                                    {item.description && (
                                                                        <p className="text-sm text-muted-foreground mt-1 mb-2">
                                                                            {item.description}
                                                                        </p>
                                                                    )}
                                                                    <RichTextEditor
                                                                        content={data.content_data[key] || ''}
                                                                        onChange={(value) => handleContentChange(key, value)}
                                                                        placeholder={item.placeholder || 'Start typing...'}
                                                                        className="mt-2"
                                                                    />
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </Card>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex justify-between mt-6">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setCurrentTab('basic')}
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={() => setCurrentTab('branch')}
                                            disabled={!data.structure_id}
                                        >
                                            Next: Branches (Optional)
                                        </Button>
                                    </div>
                                </Card>
                            </TabsContent>

                            {/* TAB 3: Branch & Integration */}
                            <TabsContent value="branch">
                                <Card className="p-6">
                                    <h2 className="text-2xl font-bold mb-2">Git Branch Information</h2>
                                    <p className="text-muted-foreground mb-6">
                                        Link this document to Git branches and Jira tasks (optional)
                                    </p>

                                    {data.branches.map((branch, index) => (
                                        <Card key={index} className="p-4 mb-4">
                                            <div className="flex justify-between items-start mb-4">
                                                <h4 className="font-semibold">
                                                    Branch {index + 1}: {branch.task_id || 'New Branch'}
                                                </h4>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeBranch(index)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label>Jira Task ID *</Label>
                                                    <Input
                                                        value={branch.task_id}
                                                        onChange={(e) => updateBranch(index, 'task_id', e.target.value)}
                                                        placeholder="e.g., PROJ-123"
                                                        className="mt-1"
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Branch Name *</Label>
                                                    <Input
                                                        value={branch.branch_name}
                                                        onChange={(e) => updateBranch(index, 'branch_name', e.target.value)}
                                                        placeholder="e.g., feature/PROJ-123"
                                                        className="mt-1"
                                                    />
                                                </div>
                                                <div className="col-span-2">
                                                    <Label>Task Title</Label>
                                                    <Input
                                                        value={branch.task_title}
                                                        onChange={(e) => updateBranch(index, 'task_title', e.target.value)}
                                                        placeholder="Brief description of the task"
                                                        className="mt-1"
                                                    />
                                                </div>
                                                <div className="col-span-2">
                                                    <Label>Repository URL</Label>
                                                    <Input
                                                        type="url"
                                                        value={branch.repository_url}
                                                        onChange={(e) => updateBranch(index, 'repository_url', e.target.value)}
                                                        placeholder="https://github.com/company/project"
                                                        className="mt-1"
                                                    />
                                                </div>
                                            </div>
                                        </Card>
                                    ))}

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={addBranch}
                                        className="w-full gap-2"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add Branch
                                    </Button>

                                    <div className="flex justify-between mt-6">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setCurrentTab('structure')}
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={() => setCurrentTab('permissions')}
                                        >
                                            Next: Permissions (Optional)
                                        </Button>
                                    </div>
                                </Card>
                            </TabsContent>

                            {/* TAB 4: Permissions */}
                            <TabsContent value="permissions">
                                <Card className="p-6">
                                    <h2 className="text-2xl font-bold mb-6">Permissions</h2>

                                    {/* Editors */}
                                    <div className="mb-8">
                                        <h3 className="text-lg font-semibold mb-2">Document Editors</h3>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Assign editors who can collaborate on this document
                                        </p>

                                        {data.editors.map((editor, index) => (
                                            <Card key={index} className="p-4 mb-4">
                                                <div className="flex justify-between items-start mb-4">
                                                    <h4 className="font-semibold">
                                                        Editor {index + 1}
                                                    </h4>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeEditor(index)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <Label>User *</Label>
                                                        <Select
                                                            value={editor.user_id?.toString() || ''}
                                                            onValueChange={(value) =>
                                                                updateEditor(index, 'user_id', parseInt(value))
                                                            }
                                                        >
                                                            <SelectTrigger className="mt-1">
                                                                <SelectValue placeholder="Select user..." />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {users.map((user) => (
                                                                    <SelectItem key={user.id} value={user.id.toString()}>
                                                                        {user.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div>
                                                        <Label>Access Type *</Label>
                                                        <Select
                                                            value={editor.access_type}
                                                            onValueChange={(value) =>
                                                                updateEditor(index, 'access_type', value)
                                                            }
                                                        >
                                                            <SelectTrigger className="mt-1">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="full">Full Access</SelectItem>
                                                                <SelectItem value="limited">Limited Access</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}

                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={addEditor}
                                            className="w-full gap-2"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Add Editor
                                        </Button>
                                    </div>

                                    {/* Reviewers */}
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Document Reviewers</h3>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Assign reviewers for approval and feedback
                                        </p>

                                        {data.reviewers.map((reviewer, index) => (
                                            <Card key={index} className="p-4 mb-4">
                                                <div className="flex justify-between items-start mb-4">
                                                    <h4 className="font-semibold">
                                                        Reviewer {index + 1}
                                                    </h4>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeReviewer(index)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <Label>Reviewer *</Label>
                                                        <Select
                                                            value={reviewer.user_id?.toString() || ''}
                                                            onValueChange={(value) =>
                                                                updateReviewer(index, 'user_id', parseInt(value))
                                                            }
                                                        >
                                                            <SelectTrigger className="mt-1">
                                                                <SelectValue placeholder="Select reviewer..." />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {users.map((user) => (
                                                                    <SelectItem key={user.id} value={user.id.toString()}>
                                                                        {user.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div>
                                                        <Label>Status *</Label>
                                                        <Select
                                                            value={reviewer.status}
                                                            onValueChange={(value) =>
                                                                updateReviewer(index, 'status', value)
                                                            }
                                                        >
                                                            <SelectTrigger className="mt-1">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="pending">Pending</SelectItem>
                                                                <SelectItem value="in_progress">In Progress</SelectItem>
                                                                <SelectItem value="approved">Approved</SelectItem>
                                                                <SelectItem value="rejected">Rejected</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}

                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={addReviewer}
                                            className="w-full gap-2"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Add Reviewer
                                        </Button>
                                    </div>

                                    <div className="flex justify-between mt-6">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setCurrentTab('branch')}
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={() => setCurrentTab('references')}
                                        >
                                            Next: References (Optional)
                                        </Button>
                                    </div>
                                </Card>
                            </TabsContent>

                            {/* TAB 5: References & Links */}
                            <TabsContent value="references">
                                <Card className="p-6">
                                    <h2 className="text-2xl font-bold mb-6">References & Links</h2>

                                    {/* Document References */}
                                    <div className="mb-8">
                                        <h3 className="text-lg font-semibold mb-2">Document References</h3>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Link to other related documents
                                        </p>

                                        {data.references.map((ref, index) => (
                                            <Card key={index} className="p-4 mb-4">
                                                <div className="flex justify-between items-start mb-4">
                                                    <h4 className="font-semibold">Reference {index + 1}</h4>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeReference(index)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>

                                                <div className="space-y-3">
                                                    <div>
                                                        <Label>Target Document</Label>
                                                        <Input
                                                            type="number"
                                                            value={ref.target_document_id || ''}
                                                            onChange={(e) =>
                                                                updateReference(
                                                                    index,
                                                                    'target_document_id',
                                                                    parseInt(e.target.value) || null
                                                                )
                                                            }
                                                            placeholder="Document ID"
                                                            className="mt-1"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label>Context</Label>
                                                        <Textarea
                                                            value={ref.context}
                                                            onChange={(e) =>
                                                                updateReference(index, 'context', e.target.value)
                                                            }
                                                            placeholder="Why is this document referenced?"
                                                            rows={2}
                                                            className="mt-1"
                                                        />
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}

                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={addReference}
                                            className="w-full gap-2"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Add Reference
                                        </Button>
                                    </div>

                                    {/* External Links */}
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">External Links</h3>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Add links to external resources
                                        </p>

                                        {data.links.map((link, index) => (
                                            <Card key={index} className="p-4 mb-4">
                                                <div className="flex justify-between items-start mb-4">
                                                    <h4 className="font-semibold">Link {index + 1}</h4>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeLink(index)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>

                                                <div className="space-y-3">
                                                    <div>
                                                        <Label>Title *</Label>
                                                        <Input
                                                            value={link.title}
                                                            onChange={(e) => updateLink(index, 'title', e.target.value)}
                                                            placeholder="Link title"
                                                            className="mt-1"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label>URL *</Label>
                                                        <Input
                                                            type="url"
                                                            value={link.url}
                                                            onChange={(e) => updateLink(index, 'url', e.target.value)}
                                                            placeholder="https://example.com"
                                                            className="mt-1"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label>Description</Label>
                                                        <Textarea
                                                            value={link.description}
                                                            onChange={(e) =>
                                                                updateLink(index, 'description', e.target.value)
                                                            }
                                                            placeholder="Brief description of the link"
                                                            rows={2}
                                                            className="mt-1"
                                                        />
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}

                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={addLink}
                                            className="w-full gap-2"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Add Link
                                        </Button>
                                    </div>

                                    <div className="flex justify-between mt-6">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setCurrentTab('permissions')}
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={() => setCurrentTab('settings')}
                                        >
                                            Next: Settings
                                        </Button>
                                    </div>
                                </Card>
                            </TabsContent>

                            {/* TAB 6: Settings */}
                            <TabsContent value="settings">
                                <Card className="p-6">
                                    <h2 className="text-2xl font-bold mb-6">Document Settings</h2>

                                    <div className="grid grid-cols-3 gap-6 mb-8">
                                        {/* Visibility */}
                                        <div>
                                            <Label>Visibility</Label>
                                            <Select
                                                value={data.visibility}
                                                onValueChange={(value: any) => setData('visibility', value)}
                                            >
                                                <SelectTrigger className="mt-2">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="public">Public</SelectItem>
                                                    <SelectItem value="private">Private</SelectItem>
                                                    <SelectItem value="team">Team</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Status */}
                                        <div>
                                            <Label>Status</Label>
                                            <Select
                                                value={data.status}
                                                onValueChange={(value: any) => setData('status', value)}
                                            >
                                                <SelectTrigger className="mt-2">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="draft">Draft</SelectItem>
                                                    <SelectItem value="pending_review">Pending Review</SelectItem>
                                                    <SelectItem value="published">Published</SelectItem>
                                                    <SelectItem value="completed">Completed</SelectItem>
                                                    <SelectItem value="stale">Stale</SelectItem>
                                                    <SelectItem value="archived">Archived</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Approval Status */}
                                        <div>
                                            <Label>Approval Status</Label>
                                            <Select
                                                value={data.approval_status}
                                                onValueChange={(value: any) => setData('approval_status', value)}
                                            >
                                                <SelectTrigger className="mt-2">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="not_submitted">Not Submitted</SelectItem>
                                                    <SelectItem value="pending">Pending</SelectItem>
                                                    <SelectItem value="approved">Approved</SelectItem>
                                                    <SelectItem value="rejected">Rejected</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Watchers */}
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Document Watchers</h3>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Users who will be notified of changes to this document
                                        </p>

                                        <div className="flex flex-wrap gap-2">
                                            {users.map((user) => (
                                                <Badge
                                                    key={user.id}
                                                    variant={
                                                        data.watchers.includes(user.id) ? 'default' : 'outline'
                                                    }
                                                    className="cursor-pointer"
                                                    onClick={() => {
                                                        const newWatchers = data.watchers.includes(user.id)
                                                            ? data.watchers.filter((id) => id !== user.id)
                                                            : [...data.watchers, user.id];
                                                        setData('watchers', newWatchers);
                                                    }}
                                                >
                                                    {user.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex justify-between mt-6">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setCurrentTab('references')}
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={() => setCurrentTab('basic')}
                                        >
                                            Review & Submit
                                        </Button>
                                    </div>
                                </Card>
                            </TabsContent>
                        </Tabs>

                        {/* Submit Buttons */}
                        <div className="flex justify-end gap-4 mt-8">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.visit(`/documents/${document.slug}`)}
                                disabled={processing}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing || !canSubmit}
                                className="gap-2"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-4 w-4" />
                                        Update Document
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
