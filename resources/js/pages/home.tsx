import { DocumentCard } from '@/components/document-card';
import { SearchBar } from '@/components/search-bar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, BookOpen, FileText, Sparkles, TrendingUp, Users } from 'lucide-react';
import React from 'react';

interface HomeProps {
    featuredDocuments: any[];
    recentDocuments: any[];
    popularCategories: any[];
    stats: {
        totalDocuments: number;
        totalUsers: number;
        totalViews: number;
    };
}

export default function Home({ featuredDocuments, recentDocuments, popularCategories, stats }: HomeProps) {
    return (
        <>
            <Head title="Home - Structured Documentation" />

            <div className="min-h-screen">
                {/* Hero Section */}
                <section className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 text-white">
                    {/* Background pattern */}
                    <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />

                    <div className="container relative mx-auto px-4 py-20 md:py-32">
                        <div className="max-w-4xl mx-auto text-center">
                            {/* Badge */}
                            <div className="mb-6 inline-flex">
                                <Badge variant="secondary" className="gap-1.5">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    Welcome to Documentation Hub
                                </Badge>
                            </div>

                            {/* Heading */}
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
                                Discover & Share
                                <br />
                                <span className="text-brand-200">Knowledge Together</span>
                            </h1>

                            {/* Description */}
                            <p className="text-xl md:text-2xl text-brand-100 mb-10 max-w-2xl mx-auto">
                                Your central hub for structured documentation, collaborative editing, and knowledge sharing.
                            </p>

                            {/* Search Bar */}
                            <div className="max-w-2xl mx-auto mb-8">
                                <SearchBar placeholder="Search thousands of documents..." />
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
                                <div className="text-center">
                                    <div className="text-3xl font-bold mb-1">{formatNumber(stats.totalDocuments)}</div>
                                    <div className="text-sm text-brand-200">Documents</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold mb-1">{formatNumber(stats.totalUsers)}</div>
                                    <div className="text-sm text-brand-200">Contributors</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold mb-1">{formatNumber(stats.totalViews)}</div>
                                    <div className="text-sm text-brand-200">Total Views</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Wave divider */}
                    <div className="absolute bottom-0 left-0 right-0">
                        <svg
                            viewBox="0 0 1440 100"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-full h-auto"
                        >
                            <path
                                d="M0 0L60 8.33C120 16.67 240 33.33 360 41.67C480 50 600 50 720 41.67C840 33.33 960 16.67 1080 16.67C1200 16.67 1320 33.33 1380 41.67L1440 50V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0V0Z"
                                fill="currentColor"
                                className="text-background"
                            />
                        </svg>
                    </div>
                </section>

                {/* Featured Documents */}
                <section className="container mx-auto px-4 py-16">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">Featured Documents</h2>
                            <p className="text-muted-foreground">Handpicked high-quality documentation</p>
                        </div>
                        <Button variant="outline" asChild>
                            <Link href="/documents">
                                View All
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredDocuments.map((doc) => (
                            <DocumentCard key={doc.id} document={doc} />
                        ))}
                    </div>
                </section>

                {/* Categories */}
                <section className="bg-muted/30 py-16">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-3">Explore by Category</h2>
                            <p className="text-muted-foreground">Browse documentation by topic</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
                            {popularCategories.map((category) => (
                                <Link
                                    key={category.id}
                                    href={`/categories/${category.slug}`}
                                    className="group"
                                >
                                    <Card className="p-6 text-center card-hover h-full">
                                        <div className="text-4xl mb-3">{category.icon || '📁'}</div>
                                        <h3 className="font-semibold mb-1 group-hover:text-brand-600 transition-colors">
                                            {category.name}
                                        </h3>
                                        <p className="text-xs text-muted-foreground">
                                            {category.documents_count} docs
                                        </p>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Recent Updates */}
                <section className="container mx-auto px-4 py-16">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">Recently Updated</h2>
                            <p className="text-muted-foreground">Latest changes to documentation</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {recentDocuments.map((doc) => (
                            <DocumentCard key={doc.id} document={doc} />
                        ))}
                    </div>
                </section>

                {/* Features/Benefits */}
                <section className="bg-muted/30 py-16">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-3">Why Use Our Platform?</h2>
                            <p className="text-muted-foreground">Everything you need for great documentation</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            <Card className="p-6 text-center">
                                <div className="w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center mx-auto mb-4">
                                    <BookOpen className="w-6 h-6 text-brand-600" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">Structured Content</h3>
                                <p className="text-sm text-muted-foreground">
                                    Organize documentation with customizable templates and sections
                                </p>
                            </Card>

                            <Card className="p-6 text-center">
                                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                                    <Users className="w-6 h-6 text-green-600" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">Team Collaboration</h3>
                                <p className="text-sm text-muted-foreground">
                                    Work together with comments, reviews, and real-time editing
                                </p>
                            </Card>

                            <Card className="p-6 text-center">
                                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-4">
                                    <TrendingUp className="w-6 h-6 text-purple-600" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">Quality Tracking</h3>
                                <p className="text-sm text-muted-foreground">
                                    Monitor documentation health and contributor rankings
                                </p>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="container mx-auto px-4 py-16">
                    <Card className="bg-gradient-brand text-white p-12 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
                        <p className="text-xl mb-8 text-brand-100 max-w-2xl mx-auto">
                            Join our community and start creating amazing documentation today
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button size="lg" variant="secondary" asChild>
                                <Link href="/documents">
                                    <FileText className="mr-2 w-5 h-5" />
                                    Browse Documents
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20" asChild>
                                <Link href="/dashboard">
                                    Get Started
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Link>
                            </Button>
                        </div>
                    </Card>
                </section>
            </div>
        </>
    );
}

function formatNumber(num: number): string {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
}
