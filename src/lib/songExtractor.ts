// songExtractor.ts

// --- Step 1: Define Types (expanded to match the full RouterData schema) ---

// Primitive and Utility Types
export interface Color { rgb: string; alpha?: string }
export interface UrlObject { uri: string; urls: string[]; template_prefix: string }
export interface PlayerBgUrlObject extends UrlObject { template: string }
export interface AvatarUrlObject { urls: string[]; need_complete_url: boolean }
export interface AvatarFrame { resource_id: string; url: UrlObject }

// Lyrics-related Types
export interface Word { text: string; startMs: number; endMs: number }
export interface Sentence { startMs: number; endMs: number; text: string; words: Word[]; type?: 'lrc' }
export interface Lyrics { lyricType: 'krc'; sentences: Sentence[] }

// User and Comment Types
export interface UserInfo {
  id: string;
  nickname: string;
  medium_avatar_url: AvatarUrlObject;
  thumb_avatar_url: AvatarUrlObject;
  artist_id: string;
  secret: boolean;
  test_tag: number;
  vip_stage: string;
  is_vip: boolean;
  avatar_frame?: AvatarFrame;
}
export interface UserArtistInfo { user_artist_type: number; user_brief: UserInfo }
export interface Comment {
  id: string;
  content: string;
  count_digged: number;
  time_created: number;
  user: UserInfo;
  count_reply: number;
  user_artist_info: UserArtistInfo;
  service_id: string;
}
export interface CommentsStruct { comments: Comment[]; count: number }

// Track and Album-related Types
export interface Album {
  id: string;
  name: string;
  release_date: number;
  url_cover: UrlObject;
  url_player_bg: PlayerBgUrlObject;
  cover_gradient_effect_color: { rgb: string }[];
  playing_wave_color: Color | null;
  paused_wave_color: Color | null;
}
export interface Artist {
  id: string;
  name: string;
  url_avatar: UrlObject;
  state: { blocked_by_me: boolean };
  user_info?: UserInfo;
  simple_display_name: string;
  user_artist_type: number;
}
export interface Stats { count_collected: number; count_comment: number; count_shared: number }
export interface BitRate { br: number; size: number; quality: string }
export interface SongMaker { name: string }
export interface SongMakerTeam { composers: SongMaker[]; lyricists: SongMaker[] }
export interface Colors {
  cover_gradient_effect_color: { rgb: string }[];
  normal_lyric_color: Color;
  playing_lyric_color: Color;
  recommend_reason_background_color: Color;
  featured_comment_tag_color: Color;
  background_color: Color;
  playing_wave_color: Color;
  paused_wave_color: Color;
  comment_share_additional_color: Color;
  base_colors: { rgb: string }[];
  non_interactive_anchor_background: Color;
}
export interface TagInfo { tag_id: number | string; tag_name: string }
export interface Tag { category: TagInfo; first_level_tag: TagInfo; second_level_tag?: TagInfo }
export interface QualityDetail { condition: string; need_vip: boolean; need_purchase: boolean }
export interface QualityAccess { play_detail: QualityDetail; download_detail: QualityDetail }
export interface QualityMap {
  medium: QualityAccess;
  higher: QualityAccess;
  highest: QualityAccess;
  lossless: QualityAccess;
  spatial: QualityAccess;
}
export interface LabelInfo {
  only_vip_download: boolean;
  quality_only_vip_can_download: string[];
  quality_only_vip_can_play: string[];
  new_release_label: { text: string; event_attr: string };
  quality_map: QualityMap;
}
export interface AuditionInfo { vid: string; duration_ms?: number; start_time_ms?: number }
export interface Fragment { type: 'mute_tail'; start_time: number; end_time: number }

export interface Track {
  id: string;
  album: Album;
  artists: Artist[];
  duration: number;
  name: string;
  state: Record<string, unknown>;
  stats: Stats;
  vid: string;
  sim_id: number;
  audition_info: AuditionInfo;
  media_type: 'track';
  vocal: number;
  plug_status: { can_plug: boolean; is_plugged: boolean };
  tags: Tag[];
  relation_media?: string;
  lang_codes?: string[];
  fragments?: Fragment[];
}
export interface ListTrack { track: Track; already_upload: boolean; create_time: number; update_time: number }

export interface TrackInfo {
  id: string;
  album: Album;
  artists: Artist[];
  duration: number;
  name: string;
  preview: Record<string, unknown>;
  state: Record<string, unknown>;
  stats: Stats;
  vid: string;
  label_info: LabelInfo;
  sim_id: number;
  bit_rates: BitRate[];
  audition_info: Record<string, unknown>;
  song_maker_team: SongMakerTeam;
  media_type: 'track';
  colors: Colors;
  limited_free_info: null;
  vocal: number;
  lang_codes: string[];
  first_vocal: { duration: number; start: number };
  sharable_platforms: string[];
  playable_range: { duration: number; start: number };
  plug_status: { can_plug: boolean; is_plugged: boolean };
  tags: Tag[];
}

export interface Anchor {
  type: string;
  text: { contents: string[]; trunc_pos: number; fallback_text: string };
  require_login: boolean;
  background_color: { rgb: string };
  show_jump_arrow: boolean;
  style_version: number;
  log_extra: string;
}

export interface AudioWithLyricsOption {
  hasCopyright: boolean;
  artistIdStr: string;
  status_code: number;
  track_id: string;
  gradientBackgroundColor: string;
  backgroundColor: string;
  vid: string;
  kid: string;
  url: string;
  songMakerTeamSentences: string[];
  lyrics: Lyrics;
  uuid: string;
  duration: number;
  encrypt: boolean;
  artistName: string;
  anchor: Anchor;
  trackName: string;
  trackInfo: TrackInfo;
  previewStart: number;
  previewEnd: number;
  coverURL: string;
  group_playable_level: string;
  group_download_level: string;
  album_id: string;
  genre_tag: string;
  commentsStruct: CommentsStruct;
  albumTracks: any[];
  artistTracks: ListTrack[];
  relatedTracks: ListTrack[];
  chartTracks: ListTrack[];
  create_time: number;
  update_time: number;
  already_upload: boolean;
}

// Page and Metadata Types
export interface MetaData {
  url: string;
  isIOS: boolean;
  headers: Record<string, string>;
  logger: Record<string, never>;
  isWindows: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isSEO: boolean;
  platform: string;
  userAgent: string;
}
export interface SeoParams {
  referrer: string | null;
  referrer_path: string;
  referrer_host: string;
  url: string;
  url_path: string;
  user_agent: string;
  is_crawler: boolean;
  status_code: number;
  PC_or_M: 'PC';
  group_type: 'track';
}
export interface SongPageData { track_id: string; audioWithLyricsOption: AudioWithLyricsOption; isWindows: boolean; metaData: MetaData; isMobile: boolean; isSEO: boolean; seoParams: SeoParams; isTablet: boolean; enable_ssr_cache: boolean; happenError: boolean; testTime: string; luna_share_node_vid: string }
export interface RouterData { loaderData: { song_layout: null; 'song_(id)/page': SongPageData }; errors: null }

// 定义最终输出的对象结构（向后兼容并扩展）
export interface FormattedLyrics {
  lrc: string;
  wordLrc: string;
}

export interface SongInfo {
  title: string;
  artists: string[];
  album: string;
  coverUrl: string;
  audioUrl: string;
  lyrics: FormattedLyrics;
  contributors?: { lyricists?: string[]; composers?: string[] };
  // enriched fields
  trackInfo?: TrackInfo;
  bitRates?: BitRate[];
  labelInfo?: LabelInfo;
  stats?: Stats;
  colors?: Colors;
  albumInfo?: Album;
  artistDetails?: Artist[];
  comments?: CommentsStruct;
  artistTracks?: ListTrack[];
  relatedTracks?: ListTrack[];
  chartTracks?: ListTrack[];
  anchor?: Anchor;
}

export interface ExtractionDebugInfo {
  logs: string[];
  foundScriptTags: number;
  matchedStrategy?: string;
  scriptPreviewStart?: string;
  scriptPreviewEnd?: string;
  jsonLength?: number;
  loaderKeys?: string[] | string;
}

export interface ExtractOptions {
  debug?: boolean;
  expectedLoaderKey?: string;
}

function pushLog(debug: ExtractionDebugInfo | null, ...parts: any[]) {
  if (!debug) return;
  try {
    debug.logs.push(parts.map(p => (typeof p === 'string' ? p : JSON.stringify(p))).join(' '));
  } catch {
    // ignore
  }
}

 // --- Step 2: Helper functions for lyric formatting ---

 /**
  * 将毫秒数格式化为 [mm:ss.xx] 的 LRC 时间标签
  * @param milliseconds - 毫秒数
  * @returns 格式化后的时间字符串
  */
 function formatLrcTime(milliseconds: number): string {
   if (milliseconds < 0) milliseconds = 0;
   const totalSeconds = milliseconds / 1000;
   const minutes = Math.floor(totalSeconds / 60);
   const seconds = totalSeconds % 60;

   const paddedMinutes = String(minutes).padStart(2, '0');
   const paddedSeconds = seconds.toFixed(2).padStart(5, '0');

   return `[${paddedMinutes}:${paddedSeconds}]`;
 }

  /**
   * 将 JSON 歌词数据转换为 LRC 和逐字歌词格式
   */
  function formatLyrics(lyricsData: Lyrics): FormattedLyrics {
   const lrcLines: string[] = [];
   const wordLrcLines: string[] = [];

   // 过滤掉非歌词的元数据行 (如作曲、作词信息)
   const actualLyrics = lyricsData.sentences.filter(
     sentence => sentence.type !== 'lrc' && sentence.words && sentence.words.length > 0
   );

   for (const sentence of actualLyrics) {
     const timeTag = formatLrcTime(sentence.startMs);

     // 1. 构建标准 LRC 歌词
     lrcLines.push(`${timeTag}${sentence.text}`);

     // 2. 构建逐字歌词 (Enhanced LRC)
     const wordTags = sentence.words
       .map(word => `<${word.startMs},${word.endMs}>${word.text}`)
       .join('');
     wordLrcLines.push(`${timeTag}${wordTags}`);
   }

   return {
     lrc: lrcLines.join('\n'),
     wordLrc: wordLrcLines.join('\n'),
   };
 }


 // --- Step 3: The main extraction function ---

function extractContributors(lyricsData: Lyrics | undefined): {
  lyricists?: string[];
  composers?: string[];
} | undefined {
  if (!lyricsData || !Array.isArray(lyricsData.sentences)) return undefined;
  const metaLines = lyricsData.sentences.filter(s => s.type === 'lrc' && typeof s.text === 'string');
  if (!metaLines.length) return undefined;

  const lyricists: string[] = [];
  const composers: string[] = [];

  const nameSplit = (value: string) =>
    value
      .split(/[\/、，,;；\s]+/)
      .map(s => s.trim())
      .filter(Boolean);

  for (const meta of metaLines) {
    const text = meta.text.trim();
    // 常见格式："作词：XXX"，"作曲: YYY"，也可能包含英文
    const lyricistMatch = text.match(/(?:作词|词|Lyricist|Lyrics\s*by)[:：]\s*(.+)$/i);
    const composerMatch = text.match(/(?:作曲|曲|Composer|Music\s*by)[:：]\s*(.+)$/i);
    if (lyricistMatch && lyricistMatch[1]) {
      lyricists.push(...nameSplit(lyricistMatch[1]));
    }
    if (composerMatch && composerMatch[1]) {
      composers.push(...nameSplit(composerMatch[1]));
    }
  }

  const unique = (arr: string[]) => Array.from(new Set(arr));
  const result: { lyricists?: string[]; composers?: string[] } = {};
  if (lyricists.length) result.lyricists = unique(lyricists);
  if (composers.length) result.composers = unique(composers);
  return Object.keys(result).length ? result : undefined;
}

/**
 * Extract the JSON text starting at the first balanced '{' after a given index.
 */
function extractBalancedJsonText(source: string, startIndex: number): string | null {
  const firstBrace = source.indexOf('{', startIndex);
  if (firstBrace === -1) return null;
  let depth = 0;
  let inString: false | '"' | "'" = false;
  let escaped = false;
  for (let i = firstBrace; i < source.length; i++) {
    const ch = source[i];
    if (inString) {
      if (!escaped && ch === inString) {
        inString = false;
      }
      escaped = !escaped && ch === '\\';
      continue;
    }
    if (ch === '"' || ch === "'") {
      inString = ch as '"' | "'";
      escaped = false;
      continue;
    }
    if (ch === '{') depth++;
    if (ch === '}') {
      depth--;
      if (depth === 0) {
        return source.substring(firstBrace, i + 1);
      }
    }
  }
  return null;
}

/**
 * Find inline JSON data embedded in script tags within an HTML document.
 * Returns the parsed object and optional debug info.
 */
export function extractInlineDataFromHtml(
  htmlContent: string,
  options?: ExtractOptions
): { parsedData: any | null; jsonText: string | null; debug?: ExtractionDebugInfo } {
  const debug: ExtractionDebugInfo | null = options?.debug
    ? { logs: [], foundScriptTags: 0 }
    : null;

  pushLog(debug, 'HTML length:', htmlContent.length);

  // Strategy 1: specific script with data-script-src="modern-inline"
  const modernInlineRegex = /<script[^>]*data-script-src="modern-inline"[^>]*>([\s\S]*?)<\/script>/i;
  let match = htmlContent.match(modernInlineRegex);
  if (!match) {
    pushLog(debug, 'modern-inline script not found, scanning all scripts');
  }

  // Fallback: any script tags
  const allScripts = htmlContent.match(/<script[^>]*>[\s\S]*?<\/script>/gi) || [];
  if (!match && allScripts.length > 0) {
    for (const script of allScripts) {
      if (/(_ROUTER_DATA|loaderData|window\._ROUTER_DATA)\s*=/.test(script)) {
        match = script.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
        if (match) break;
      }
    }
  }

  const scriptsCount = (htmlContent.match(/<script\b/gi) || []).length;
  if (debug) debug.foundScriptTags = scriptsCount;
  if (!match || !match[1]) {
    pushLog(debug, 'No candidate script tag containing inline data');
    return { parsedData: null, jsonText: null, debug: debug || undefined };
  }

  let scriptContent = match[1].trim();
  if (debug) {
    debug.scriptPreviewStart = scriptContent.substring(0, 200);
    debug.scriptPreviewEnd = scriptContent.substring(Math.max(0, scriptContent.length - 200));
  }

  // Normalize: often `_ROUTER_DATA = {...};` or `window._ROUTER_DATA = {...};`
  const eqIndex = scriptContent.indexOf('=');
  let jsonText: string | null = null;
  if (eqIndex !== -1) {
    jsonText = extractBalancedJsonText(scriptContent, eqIndex + 1);
    if (jsonText) {
      if (debug) debug.matchedStrategy = 'balanced-brace-after-equals';
    }
  }

  // If still not found, try to trim trailing junk after final balanced '}'
  if (!jsonText) {
    // Best-effort trimming like previous approach
    let cleaned = scriptContent.replace(/^\s*(?:window\.)?_ROUTER_DATA\s*=\s*/i, '').trim();
    if (cleaned.endsWith(';')) cleaned = cleaned.slice(0, -1);
    const lastBraceIndex = cleaned.lastIndexOf('}');
    if (lastBraceIndex !== -1) {
      cleaned = cleaned.substring(0, lastBraceIndex + 1);
      jsonText = cleaned;
      if (debug) debug.matchedStrategy = 'trim-to-last-brace';
    }
  }

  if (debug && jsonText) debug.jsonLength = jsonText.length;

  if (!jsonText) {
    pushLog(debug, 'Failed to isolate JSON text from script content');
    return { parsedData: null, jsonText: null, debug: debug || undefined };
  }

  try {
    const parsed = JSON.parse(jsonText);
    if (debug) debug.loaderKeys = parsed?.loaderData ? Object.keys(parsed.loaderData) : 'no-loaderData';
    return { parsedData: parsed, jsonText, debug: debug || undefined };
  } catch (error) {
    pushLog(debug, 'JSON.parse failed:', (error as Error).message);
    return { parsedData: null, jsonText, debug: debug || undefined };
  }
}

/**
 * Build SongInfo from parsed inline data object.
 */
export function constructSongInfoFromInlineData(
  parsedData: any,
  options?: ExtractOptions
): SongInfo | null {
  if (!parsedData) return null;

  const expectedKey = options?.expectedLoaderKey || 'song_(id)/page';
  let songPageData: SongPageData | undefined;

  // Preferred path
  if (parsedData.loaderData && parsedData.loaderData[expectedKey]) {
    songPageData = parsedData.loaderData[expectedKey] as SongPageData;
  } else if (parsedData.loaderData) {
    // Fallback: search first entry with audioWithLyricsOption
    for (const key of Object.keys(parsedData.loaderData)) {
      const candidate = parsedData.loaderData[key];
      if (candidate && candidate.audioWithLyricsOption) {
        songPageData = candidate as SongPageData;
        break;
      }
    }
  }

  if (!songPageData || !songPageData.audioWithLyricsOption) {
    return null;
  }

  const audioOption = songPageData.audioWithLyricsOption;
  const trackInfo = audioOption.trackInfo;

  const title = trackInfo.name;
  const artists = trackInfo.artists.map(artist => artist.name);
  const album = trackInfo.album.name;
  const coverUrl = audioOption.coverURL;
  const audioUrl = audioOption.url;
  const lyrics = formatLyrics(audioOption.lyrics);
  const contributors = extractContributors(audioOption.lyrics);

  const enriched: SongInfo = {
    title,
    artists,
    album,
    coverUrl,
    audioUrl,
    lyrics,
    contributors,
    trackInfo,
    bitRates: trackInfo.bit_rates,
    labelInfo: trackInfo.label_info,
    stats: trackInfo.stats,
    colors: trackInfo.colors,
    albumInfo: trackInfo.album,
    artistDetails: trackInfo.artists,
    comments: audioOption.commentsStruct,
    artistTracks: audioOption.artistTracks,
    relatedTracks: audioOption.relatedTracks,
    chartTracks: audioOption.chartTracks,
    anchor: audioOption.anchor,
  };

  return enriched;
}

/**
 * Produce an ESM JavaScript module exporting the SongInfo.
 */
export function toJsModule(song: SongInfo, variableName = 'song'): string {
  const json = JSON.stringify(song, null, 2);
  return `const ${variableName} = ${json};\nexport default ${variableName};\n`;
}

 /**
  * 从 HTML 内容中提取歌曲信息
  * @param htmlContent - 包含歌曲数据的完整 HTML 页面字符串
  * @returns 提取并格式化后的歌曲信息对象，如果找不到或解析失败则返回 null
  */
 export function extractSongInfoFromHtml(htmlContent: string): SongInfo | null {
  const { parsedData } = extractInlineDataFromHtml(htmlContent, { debug: false });
  return constructSongInfoFromInlineData(parsedData);
 }
