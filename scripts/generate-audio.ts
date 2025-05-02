import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { OpenAI } from 'openai';

// OpenAI APIキーを設定
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // 環境変数からAPIキーを取得
});

// コマンドライン引数からコースIDを取得する（省略可）
const courseArg = process.argv[2]; // 指定があればそのコースだけ処理

// YAMLファイルを読み込む関数
function loadYAML(filePath: string) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    return yaml.load(fileContents) as any;
  } catch (error) {
    console.error(`Error loading YAML file ${filePath}:`, error);
    return {};
  }
}

// TTSで音声を生成する関数
async function generateAudio(text: string, outputPath: string, voice = 'alloy') {
  try {
    // 既にファイルが存在する場合はスキップ
    if (fs.existsSync(outputPath)) {
      console.log(`File already exists: ${outputPath} - skipping`);
      return;
    }

    console.log(`Generating audio for: ${text.substring(0, 50)}...`);
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: voice,
      input: text,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    fs.writeFileSync(outputPath, buffer);
    console.log(`Audio file saved: ${outputPath}`);

    // API制限を避けるために少し待機
    await new Promise(resolve => setTimeout(resolve, 1000));
  } catch (error) {
    console.error(`Error generating audio for ${text.substring(0, 30)}:`, error);
  }
}

// 各週のディレクトリを処理する関数
async function processWeek(coursePath: string, audioBase: string, weekId: string) {
  console.log(`  Processing ${weekId}...`);
  const weekData = loadYAML(`${coursePath}/${weekId}/index.yaml`);
  const outputDir = `${audioBase}/${weekId}`;

  // 出力ディレクトリがなければ作成
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 日々の内容を処理
  for (const day of weekData.daily_goals || []) {
    // 単語の音声を生成
    if (day.vocabulary) {
      for (const word of day.vocabulary) {
        if (word.audio_file) {
          await generateAudio(
            word.word,
            path.join(process.cwd(), outputDir, word.audio_file),
            'onyx' // ドイツ語の場合は適切な声を選択
          );
        }
      }
    }

    // 例文の音声を生成
    if (day.examples) {
      for (const example of day.examples) {
        if (example.audio_file) {
          await generateAudio(
            example.german, // ドイツ語の例文
            path.join(process.cwd(), outputDir, example.audio_file),
            'onyx' // ドイツ語の場合は適切な声を選択
          );
        }
      }
    }
  }

  // その他の音声（週間復習など）
  if (weekData.weekly_review?.audio_file) {
    await generateAudio(
      weekData.weekly_review.final_review?.german || weekData.weekly_review.summary,
      path.join(process.cwd(), outputDir, weekData.weekly_review.audio_file),
      'onyx'
    );
  }

  console.log(`  Completed ${weekId}`);
}

// コース単位の処理
async function processCourse(courseId: string) {
  const coursePath = path.join(process.cwd(), 'data', courseId);
  const audioBase = path.join(process.cwd(), 'public', 'audio', courseId);

  if (!fs.existsSync(coursePath)) {
    console.warn(`Course directory not found: ${courseId}  -> skipping`);
    return;
  }

  console.log(`Processing course: ${courseId}`);

  // 週ディレクトリを抽出
  const items = fs.readdirSync(coursePath);
  const weekDirs = items.filter(item => {
    const itemPath = path.join(coursePath, item);
    return fs.statSync(itemPath).isDirectory() && item.startsWith('week');
  });

  console.log(`  Found ${weekDirs.length} week directories`);

  // 週ごとに処理
  for (const weekDir of weekDirs) {
    await processWeek(coursePath, audioBase, weekDir);
  }

  console.log(`Completed course: ${courseId}`);
}

// メイン処理
async function main() {
  try {
    const dataRoot = path.join(process.cwd(), 'data');

    // 対象コースの決定
    let courses: string[];
    if (courseArg) {
      courses = [courseArg];
    } else {
      courses = fs.readdirSync(dataRoot).filter(item => {
        const itemPath = path.join(dataRoot, item);
        return fs.statSync(itemPath).isDirectory();
      });
    }

    console.log(`Found ${courses.length} courses to process`);

    for (const id of courses) {
      await processCourse(id);
    }

    console.log('All audio generation completed successfully!');
  } catch (error) {
    console.error('Error in main process:', error);
  }
}

// プログラム実行
main(); 