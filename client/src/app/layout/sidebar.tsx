import type React from "react";

import { NavLink } from "react-router-dom";
import {
  Nav,
  NavList,
  PageSidebar,
  PageSidebarBody,
} from "@patternfly/react-core";
import { css } from "@patternfly/react-styles";
import nav from "@patternfly/react-styles/css/components/Nav/nav";

import { Paths } from "@app/Constants";

export const SidebarApp: React.FC = () => {
  return (
    <PageSidebar>
      <PageSidebarBody>
        <Nav id="nav-sidebar" aria-label="Nav">
          <NavList>
            <li className={nav.navItem}>
              <NavLink
                to={Paths.pullRequests}
                className={({ isActive }) =>
                  css(nav.navLink, isActive ? nav.modifiers.current : "")
                }
              >
                Pull Requests
              </NavLink>
            </li>
          </NavList>
        </Nav>
      </PageSidebarBody>
    </PageSidebar>
  );
};
