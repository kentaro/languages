import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export interface YAMLData {
  [key: string]: any;
}

/**
 * YAMLファイルを読み込む関数
 * @param filePath 相対パスまたは絶対パス
 * @returns 読み込んだYAMLデータ
 */
export function loadYAML(filePath: string): YAMLData {
  try {
    // 絶対パスでなければプロジェクトルートからの相対パスと見なす
    const fullPath = path.isAbsolute(filePath)
      ? filePath
      : path.join(process.cwd(), filePath);
    
    // ファイルが存在するか確認（デバッグ用）
    if (!fs.existsSync(fullPath)) {
      console.error(`File does not exist: ${fullPath}`);
      return {};
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const data = yaml.load(fileContents) as YAMLData;
    return data;
  } catch (error) {
    console.error(`Error loading YAML file ${filePath}:`, error);
    return {};
  }
}

/**
 * ディレクトリ内のすべてのYAMLファイルを読み込む
 * @param dirPath ディレクトリの相対パスまたは絶対パス
 * @returns 読み込んだYAMLデータの配列
 */
export function loadYAMLInDirectory(dirPath: string): YAMLData[] {
  try {
    // 絶対パスでなければプロジェクトルートからの相対パスと見なす
    const fullDirPath = path.isAbsolute(dirPath)
      ? dirPath
      : path.join(process.cwd(), dirPath);
    
    // ディレクトリが存在するか確認
    if (!fs.existsSync(fullDirPath)) {
      console.error(`Directory does not exist: ${fullDirPath}`);
      return [];
    }
    
    const files = fs.readdirSync(fullDirPath)
      .filter(file => file.endsWith('.yaml') || file.endsWith('.yml'));
    
    return files.map(file => {
      // 絶対パスを構築して loadYAML に渡す
      const fullFilePath = path.join(fullDirPath, file);
      return loadYAML(fullFilePath);
    });
  } catch (error) {
    console.error(`Error loading YAML files in directory ${dirPath}:`, error);
    return [];
  }
}

interface CourseStructure {
  overview: YAMLData;
  weeks: {
    [key: string]: YAMLData;
  };
}

/**
 * 利用可能なコースの一覧を取得
 * @returns コース情報の配列
 */
export function getAvailableCourses(): { id: string; title: string; description: string }[] {
  try {
    // データディレクトリの絶対パスを取得
    const dataDir = path.join(process.cwd(), 'data');
    
    // データディレクトリが存在するか確認
    if (!fs.existsSync(dataDir)) {
      console.error(`Data directory does not exist: ${dataDir}`);
      return [];
    }
    
    // サブディレクトリ（コース）を取得
    const courseDirs = fs.readdirSync(dataDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    return courseDirs.map(courseId => {
      try {
        // 絶対パスを構築
        const overviewPath = path.join(dataDir, courseId, 'overview.yaml');
        // 絶対パスで直接ファイルを読み込む
        const overview = loadYAML(overviewPath);
        
        return {
          id: courseId,
          title: overview.title || courseId,
          description: overview.description || '',
        };
      } catch (error) {
        console.error(`Error loading course info for ${courseId}:`, error);
        return { id: courseId, title: courseId, description: '' };
      }
    });
  } catch (error) {
    console.error('Error getting available courses:', error);
    return [];
  }
}

/**
 * courseId に "data/" の重複や絶対パスが混在しても問題なく解決できるように，
 * 最終的なコースディレクトリの絶対パスを返すユーティリティ．
 *
 * 受け取る引数の想定：
 *   1) "german-diploma-in-japan-grade-3"        ← 推奨（純粋なコースID）
 *   2) "data/german-diploma-in-japan-grade-3"  ← 古い呼び出し箇所との互換
 *   3) "/abs/path/to/data/german-diploma-in-japan-grade-3" ← 直接絶対パス
 */
function resolveCourseDir(courseId: string): string {
  // 引数が既に絶対パスならそのまま返す
  if (path.isAbsolute(courseId)) {
    return courseId;
  }

  // 先頭に "data/" あるいは "data\\" が付いている場合は取り除く
  const cleanedId = courseId.replace(/^data[\\/]+/, "");

  // data ディレクトリ配下に結合して絶対パスを生成
  return path.join(process.cwd(), "data", cleanedId);
}

/**
 * コースの詳細構造を取得
 * @param courseId コースID
 * @returns コース構造（概要と週ごとのデータ）
 */
export function getCourseStructure(courseId: string): CourseStructure {
  try {
    // コースディレクトリの絶対パスを解決
    const courseDir = resolveCourseDir(courseId);
    
    // コースディレクトリが存在するか確認
    if (!fs.existsSync(courseDir)) {
      console.error(`Course directory does not exist: ${courseDir}`);
      return { 
        overview: { title: "コースが見つかりません", description: "" }, 
        weeks: {} 
      };
    }
    
    // 概要ファイルの絶対パスを構築
    const overviewPath = path.join(courseDir, 'overview.yaml');
    
    // 概要ファイルが存在するか確認
    if (!fs.existsSync(overviewPath)) {
      console.error(`Overview file does not exist: ${overviewPath}`);
      return { 
        overview: { title: "コース概要が見つかりません", description: "" }, 
        weeks: {} 
      };
    }
    
    // 概要を読み込む（絶対パスを使用）
    const overview = loadYAML(overviewPath);
    
    // 週ごとのデータを読み込む
    const weeks: { [key: string]: YAMLData } = {};
    
    // 週のディレクトリを探す（weekXという名前のディレクトリ）
    const items = fs.readdirSync(courseDir);
    
    for (const item of items) {
      const itemPath = path.join(courseDir, item);
      if (fs.statSync(itemPath).isDirectory() && item.startsWith('week')) {
        try {
          const weekIndexPath = path.join(itemPath, 'index.yaml');
          
          // ファイルが存在するか確認
          if (!fs.existsSync(weekIndexPath)) {
            console.error(`Week index file does not exist: ${weekIndexPath}`);
            continue;
          }
          
          // 週データを読み込む（絶対パスを使用）
          const weekData = loadYAML(weekIndexPath);
          
          if (Object.keys(weekData).length > 0) {
            weeks[item] = weekData;
          }
        } catch (error) {
          console.error(`Error loading week data for ${item}:`, error);
          // エラーが発生しても続行
        }
      }
    }
    
    return { overview, weeks };
  } catch (error) {
    console.error(`Error loading course structure from ${courseId}:`, error);
    return { 
      overview: { title: "コースデータの読み込みに失敗しました", description: "" }, 
      weeks: {} 
    };
  }
} 