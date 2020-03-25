import * as d from '../../../declarations';
import { UsedSelectors } from './used-selectors';

export interface ParseCssResults {
  diagnostics: d.Diagnostic[];
  stylesheet: CssNode;
}

export type CssNodeType =
  | 'charset'
  | 'comment'
  | 'custom-media'
  | 'document'
  | 'declaration'
  | 'font-face'
  | 'host'
  | 'import'
  | 'keyframes'
  | 'keyframe'
  | 'media'
  | 'namespace'
  | 'page'
  | 'rule'
  | 'stylesheet'
  | 'supports';

export interface CssNode {
  type?: CssNodeType;
  charset?: string;
  comment?: string;
  declarations?: CssNode[] | null;
  document?: string;
  import?: string;
  keyframes?: CssNode[] | null;
  media?: string;
  name?: string;
  namespace?: string;
  page?: string;
  position?: CssParsePosition;
  property?: string;
  rules?: CssNode[] | null;
  selectors?: string[];
  source?: string;
  stylesheet?: CssNode | null;
  supports?: string;
  value?: string;
  values?: string[];
  vendor?: string;
}

export interface CssParsePosition {
  start: any;
  end: any;
  source: any;
  content: string;
}

export interface SerializeCssOptions {
  usedSelectors?: UsedSelectors;
}

export interface SerializeOpts extends SerializeCssOptions {
  hasUsedAttrs: boolean;
  hasUsedClassNames: boolean;
  hasUsedIds: boolean;
  hasUsedTags: boolean;
  usedSelectors: UsedSelectors | null;
}
