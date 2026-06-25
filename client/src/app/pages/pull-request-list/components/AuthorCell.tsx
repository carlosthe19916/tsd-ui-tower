import type React from "react";

import { Avatar, Flex, FlexItem } from "@patternfly/react-core";

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
        <Avatar
          src={`${author.avatar_url}&s=40`}
          alt={author.login}
          size="sm"
        />
      </FlexItem>
      <FlexItem>{author.login}</FlexItem>
    </Flex>
  );
};
