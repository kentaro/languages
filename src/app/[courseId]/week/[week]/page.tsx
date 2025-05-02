import { getCourseStructure } from "@/utils/yaml-loader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AudioPlayer } from "@/components/AudioPlayer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCaseLabel } from "@/utils/labels";

interface WeekPageParams {
    courseId: string;
    week: string;
}

interface WeekPageProps {
    params: Promise<WeekPageParams>;
}

// 今は 1 コース固定なので簡易実装
export function generateStaticParams() {
    const courseId = "german-diploma-in-japan-grade-3";
    return Array.from({ length: 7 }, (_, i) => ({ courseId, week: String(i + 1) }));
}

function loadWeekData(courseId: string, weekKey: string) {
    const { overview, weeks } = getCourseStructure(courseId);
    return {
        overview,
        weekData:
            weeks[weekKey] ?? {
                week_number: Number(weekKey.replace("week", "")),
                title: `第${weekKey.replace("week", "")}週`,
                description: "データがありません",
                daily_goals: [],
                weekly_review: { summary: "", key_points: [] },
            },
    };
}

export default async function WeekPage({ params }: WeekPageProps) {
    const { courseId, week } = await params;

    const weekNumber = Number(week);
    const weekKey = `week${weekNumber}`;

    const { overview, weekData } = loadWeekData(courseId, weekKey);

    const prevWeek = weekNumber > 1 ? String(weekNumber - 1) : null;
    const nextWeek = weekNumber < 7 ? String(weekNumber + 1) : null;

    return (
        <div className="container mx-auto px-4 py-12">
            <header className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                    <Link href={`/${courseId}`} className="text-sm text-muted-foreground hover:underline">
                        ← コース概要に戻る
                    </Link>
                </div>
                <h1 className="text-3xl font-bold mb-4">{weekData.title}</h1>
                <p className="text-lg text-muted-foreground">{weekData.description}</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
                <div className="lg:col-span-3">
                    <Tabs defaultValue="daily">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="daily">日別学習内容</TabsTrigger>
                            <TabsTrigger value="review">週間復習</TabsTrigger>
                        </TabsList>

                        <TabsContent value="daily" className="p-4 border rounded-md mt-2">
                            {(weekData.daily_goals ?? []).map((day: any, index: number) => (
                                <div key={index} className="mb-8">
                                    <h3 className="text-xl font-semibold mb-4">
                                        第{day.day ?? index + 1}日: {day.title}
                                    </h3>

                                    <h4 className="text-lg font-medium mb-2">今日の学習目標</h4>
                                    <ul className="list-disc list-inside mb-4">
                                        {day.tasks?.map((task: any, tIdx: number) => (
                                            <li key={tIdx}>
                                                <span className="font-medium">{task.name}</span> - {task.description}
                                            </li>
                                        ))}
                                    </ul>

                                    {/* 文法・単語・例文など旧 UI を再利用 */}
                                    {day.grammar && (
                                        <>
                                            <h4 className="text-lg font-medium mb-2">文法ポイント</h4>
                                            {day.grammar.map((grammar: any, gIdx: number) => (
                                                <div key={gIdx} className="mb-4 p-4 bg-muted/50 rounded-md">
                                                    <h5 className="font-medium mb-2">{grammar.title}</h5>
                                                    {grammar.explanation && <p className="mb-3">{grammar.explanation}</p>}
                                                    {grammar.table && (
                                                        <div className="overflow-x-auto">
                                                            <table className="w-full border-collapse">
                                                                <thead>
                                                                    <tr>
                                                                        {Object.keys(grammar.table[0] ?? {}).map((key) => (
                                                                            <th key={key} className="py-2 pr-4 text-left font-semibold">
                                                                                {key === "gender" ? "" : getCaseLabel(key)}
                                                                            </th>
                                                                        ))}
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {grammar.table.map((row: any, rIdx: number) => (
                                                                        <tr key={rIdx} className="border-b">
                                                                            {Object.entries(row).map(([_, value], eIdx) => (
                                                                                <td key={eIdx} className="py-2 pr-4">
                                                                                    {eIdx === 0 ? <span className="font-medium">{String(value)}</span> : <span>{String(value)}</span>}
                                                                                </td>
                                                                            ))}
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </>
                                    )}

                                    {day.vocabulary && (
                                        <>
                                            <h4 className="text-lg font-medium mb-2">今日の単語</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                                                {day.vocabulary.map((word: any, wIdx: number) => (
                                                    <div key={wIdx} className="p-3 border rounded-md">
                                                        <div className="flex items-start gap-2">
                                                            {word.audio_file && (
                                                                <AudioPlayer src={`/audio/${courseId}/week${weekNumber}/${word.audio_file}`} className="mt-1" />
                                                            )}
                                                            <div>
                                                                <p className="font-medium">{word.word}</p>
                                                                <p className="text-sm text-muted-foreground">読み: {word.pronunciation}</p>
                                                                <p>{word.meaning}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}

                                    {day.examples && (
                                        <>
                                            <h4 className="text-lg font-medium mb-2">例文</h4>
                                            <div className="space-y-2 mb-4">
                                                {day.examples.map((example: any, exIdx: number) => (
                                                    <div key={exIdx} className="p-3 border rounded-md">
                                                        <div className="flex items-start gap-2">
                                                            {example.audio_file && (
                                                                <AudioPlayer src={`/audio/${courseId}/week${weekNumber}/${example.audio_file}`} className="mt-1" />
                                                            )}
                                                            <div>
                                                                <p className="font-medium">{example.german}</p>
                                                                <p className="text-sm">{example.japanese}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}

                                    {index < (weekData.daily_goals?.length ?? 0) - 1 && <Separator className="my-6" />}
                                </div>
                            )) || <p>この週の学習目標はありません</p>}
                        </TabsContent>

                        <TabsContent value="review" className="p-4 border rounded-md mt-2">
                            <div className="mb-6">
                                <h4 className="text-lg font-medium mb-2">今週のまとめ</h4>
                                <p>{weekData.weekly_review?.summary || "まとめはありません"}</p>
                            </div>

                            <div className="mb-6">
                                <h4 className="text-lg font-medium mb-2">重要ポイント</h4>
                                <ul className="list-disc list-inside space-y-2">
                                    {weekData.weekly_review?.key_points?.map((pt: string, ptIdx: number) => <li key={ptIdx}>{pt}</li>) || <li>復習ポイントがありません</li>}
                                </ul>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* サイドバー */}
                <div>
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>学習ナビゲーション</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button asChild variant="outline" className="w-full justify-start">
                                <Link href={`/${courseId}`}>コース概要に戻る</Link>
                            </Button>
                            {prevWeek && (
                                <Button asChild variant="outline" className="w-full justify-start">
                                    <Link href={`/${courseId}/week/${prevWeek}`}>← 前の週: 第{weekNumber - 1}週</Link>
                                </Button>
                            )}
                            {nextWeek && (
                                <Button asChild variant="outline" className="w-full justify-start">
                                    <Link href={`/${courseId}/week/${nextWeek}`}>次の週: 第{weekNumber + 1}週 →</Link>
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>この週の焦点</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {overview.weekly_overview?.find((w: any) => w.week === weekNumber)?.focus?.map((f: string, fi: number) => (
                                    <li key={fi} className="text-sm">• {f}</li>
                                )) || <li className="text-sm">データがありません</li>}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
} 