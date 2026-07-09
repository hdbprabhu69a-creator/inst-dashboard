export type TextBlock = {
  text: string;
  page: number;
};

export type ParsedPage = {
  page: number;
  blocks: TextBlock[];
};

export type ParsedIssue = {
  pages: ParsedPage[];
};
