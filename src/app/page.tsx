import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getAvailableCourses } from "@/utils/yaml-loader";

export default function Home() {
  // 利用可能なコースの一覧を取得
  const courses = getAvailableCourses();

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <header className="mb-16 text-center">
          <h1 className="text-5xl font-bold mb-4">Languages</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            効率的に外国語を学ぶためのオンライン学習プラットフォーム
          </p>
        </header>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">学習コース</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    コースID: {course.id}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/${course.id}`}>
                      コースを見る
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}

            {courses.length === 0 && (
              <div className="col-span-full text-center p-8 border rounded-lg">
                <p className="text-muted-foreground">現在利用可能なコースはありません。</p>
              </div>
            )}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">学習のポイント</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>段階的な学習</CardTitle>
              </CardHeader>
              <CardContent>
                <p>各コースは段階的に学習できるよう構成されており、初心者でも無理なく進められます。</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>実践的な内容</CardTitle>
              </CardHeader>
              <CardContent>
                <p>実際の会話や場面で使える表現を中心に、実践的な内容を学ぶことができます。</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>音声対応</CardTitle>
              </CardHeader>
              <CardContent>
                <p>単語や例文には音声が付いているので、正しい発音を確認しながら学習できます。</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <footer className="text-center text-sm text-muted-foreground">
          <p>© 2025 Languages. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
