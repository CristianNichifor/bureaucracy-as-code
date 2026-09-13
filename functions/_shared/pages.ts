export type PagesContext<Params extends Record<string, string> = Record<string, string>> = {
  request: Request;
  params: Params;
};

export type PagesHandler<Params extends Record<string, string> = Record<string, string>> = (
  context: PagesContext<Params>,
) => Response | Promise<Response>;

