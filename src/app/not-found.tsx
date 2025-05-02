import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold mb-6">ページが見つかりません</h1>
            <p className="text-lg text-muted-foreground mb-8">
                お探しのページは存在しないか、移動した可能性があります。
            </p>
            <Button asChild>
                <Link href="/">
                    トップページに戻る
                </Link>
            </Button>
        </div>
    );
} 