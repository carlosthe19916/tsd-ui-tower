import type React from "react";

import { Flex, FlexItem } from "@patternfly/react-core";

import type { Author } from "@app/api/models";

interface AuthorCellProps {
  author: Author;
}

export const AuthorCell: React.FC<AuthorCellProps> = ({ author }) => {
  return (
    <Flex
      spaceItems={{ default: "spaceItemsSm" }}
      alignItems={{ default: "alignItemsCenter" }}
      flexWrap={{ default: "nowrap" }}
    >
      <FlexItem>
        <img
          src={`${author.avatar_url}&s=40`}
          alt={author.login}
          width={20}
          height={20}
          style={{ borderRadius: "50%" }}
        />
      </FlexItem>
      <FlexItem>{author.login}</FlexItem>
    </Flex>
  );
};
