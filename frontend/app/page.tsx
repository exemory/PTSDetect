'use client';

import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { GetAllFilmsDocument } from '@/__generated__/graphql';

export default function Page() {
  const { data } = useSuspenseQuery(GetAllFilmsDocument);

  return <div>Hello {data.allFilms?.films?.at(0)?.director}</div>;
}
