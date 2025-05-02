import { getCourseStructure } from "@/utils/yaml-loader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

interface CoursePageParams {
    courseId: string;
}

interface CoursePageProps {
    params: Promise<CoursePageParams>;
}

// 静的ページとして生成するコースIDのリストを提供
export function generateStaticParams() {
    return [
        { courseId: 'german-diploma-in-japan-grade-3' },
        // 新しいコースを追加するときはここに追加
    ];
}

function loadCourseData(courseId: string) {
    try {
        const { overview, weeks } = getCourseStructure(courseId);
        return { overview, weeks };
    } catch (error) {
        console.error(`Failed to load course data for ${courseId}:`, error);
        return null;
    }
}

export default async function CoursePage({ params }: CoursePageProps) {
    // 非同期でparamsを受け取るため、awaitで待機
    const { courseId } = await params;

    const courseData = loadCourseData(courseId);

    if (!courseData) {
        notFound();
    }

    const { overview, weeks } = courseData;

    // 週ごとのデータを週番号でソート
    const sortedWeeks = Object.entries(weeks)
        .map(([key, data]) => ({ key, ...data } as { key: string; week_number: number; title: string; description: string }))
        .sort((a, b) => a.week_number - b.week_number);

    return (
        <div className="container mx-auto px-4 py-12">
            <header className="mb-8">
                <h1 className="text-3xl font-bold mb-4">{overview.title}</h1>
                <p className="text-lg text-muted-foreground">{overview.description}</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
                <div className="lg:col-span-3">
                    <Tabs defaultValue="overview">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="overview">概要</TabsTrigger>
                            <TabsTrigger value="curriculum">カリキュラム</TabsTrigger>
                            <TabsTrigger value="details">詳細情報</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="p-4 border rounded-md mt-2">
                            <div className="mb-6">
                                <h3 className="text-xl font-semibold mb-4">コース概要</h3>
                                <p>{overview.description}</p>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-xl font-semibold mb-4">学習目標</h3>
                                <ul className="list-disc list-inside space-y-2">
                                    {overview.goals?.map((goal: string, index: number) => (
                                        <li key={index}>{goal}</li>
                                    )) || <li>目標が設定されていません</li>}
                                </ul>
                            </div>

                            {overview.prerequisites && (
                                <div className="mb-6">
                                    <h3 className="text-xl font-semibold mb-4">前提条件</h3>
                                    <p>{overview.prerequisites}</p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="curriculum" className="p-4 border rounded-md mt-2">
                            <h3 className="text-xl font-semibold mb-4">週ごとのカリキュラム</h3>

                            <div className="space-y-4">
                                {sortedWeeks.map((week: any, index: number) => (
                                    <Card key={index} className="glass overflow-hidden">
                                        <CardHeader className="bg-muted/50">
                                            <CardTitle>
                                                第{week.week_number}週: {week.title}
                                            </CardTitle>
                                            <CardDescription>
                                                {week.description}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="pt-4">
                                            <div className="mb-4">
                                                <h4 className="text-lg font-medium mb-2">この週の焦点</h4>
                                                <ul className="list-disc list-inside space-y-1">
                                                    {overview.weekly_overview?.find((w: any) => w.week === week.week_number)?.focus?.map((item: string, fIndex: number) => (
                                                        <li key={fIndex}>{item}</li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <Button asChild variant="outline" className="w-full mt-2">
                                                <Link href={`/${courseId}/week/${week.week_number}`}>
                                                    詳細を見る →
                                                </Link>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="details" className="p-4 border rounded-md mt-2">
                            <div className="mb-6">
                                <h3 className="text-xl font-semibold mb-4">コース情報</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    {overview.duration && (
                                        <div>
                                            <h4 className="font-medium">期間</h4>
                                            <p>{overview.duration}</p>
                                        </div>
                                    )}

                                    {overview.level && (
                                        <div>
                                            <h4 className="font-medium">レベル</h4>
                                            <p>{overview.level}</p>
                                        </div>
                                    )}

                                    {overview.materials && (
                                        <div>
                                            <h4 className="font-medium">教材</h4>
                                            <p>{overview.materials}</p>
                                        </div>
                                    )}

                                    {overview.certification && (
                                        <div>
                                            <h4 className="font-medium">修了証</h4>
                                            <p>{overview.certification}</p>
                                        </div>
                                    )}
                                </div>

                                {overview.author && (
                                    <div className="mb-4">
                                        <h4 className="font-medium">作成者</h4>
                                        <p>{overview.author}</p>
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>コース情報</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium">期間</p>
                                <p>{overview.duration || "記載なし"}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium">難易度</p>
                                <p>{overview.level || "記載なし"}</p>
                            </div>

                            <Separator />

                            <Button asChild className="w-full">
                                <Link href={`/${courseId}/week/1`}>
                                    学習を始める
                                </Link>
                            </Button>

                            <Button asChild variant="outline" className="w-full">
                                <Link href="/">
                                    コース一覧に戻る
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
} 