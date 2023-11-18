"use client";

import { getClient } from "@/lib/graphql/client";
import { gql } from "@apollo/client";
import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";

const query = gql`
  query ($name: String!) {
    __type(name: $name) {
      name
    }
  }
`;

export default function Page() {
  const { data } = useSuspenseQuery(query, { variables: { name: "users" } });

  return <div>Hello {data.__type.name}!</div>;
}
