import { styled } from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import colorPallete from "../utils/colorPallete.json";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [atApplicants, setApplicants] = useState(false);
  const [atRoles, setRoles] = useState(false);

  const redirectMeTo = (path: string) => {
    navigate(path);
  };

  useEffect(() => {
    if (location.pathname.startsWith("/applicants")) setApplicants(true);
    else setApplicants(false);

    if (location.pathname.startsWith("/roles")) setRoles(true);
    else setRoles(false);
  }, [location.pathname]);

  const Wrapper = styled.div`
    height: 100%;
    width: 100%;
    background-color: ${colorPallete.primmaryColor};
    display: flex;
    flex-direction: column;
    align-items: center;
  `;

  const SidebarButton = styled.button`
    background-color: ${(props) =>
      props.isSelected
        ? colorPallete.secondaryColor
        : colorPallete.primmaryColor};
    border: 0;
    border-radius: 6px;
    width: 70%;
    height: 30px;
    color: ${colorPallete.background};

    &:hover {
      background-color: ${colorPallete.secondaryColor};
      cursor: pointer;
    }
  `;

  const Logo = styled.a`
    color: ${colorPallete.textColor};
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
      sans-serif;
    font-size: larger;
    cursor: pointer;
    margin-top: 30px;
    margin-bottom: 60px;
  `;

  return (
    <>
      <Wrapper>
        <Logo onClick={() => redirectMeTo("/")}>RedLight</Logo>
        <SidebarButton
          isSelected={atApplicants}
          onClick={() => redirectMeTo("/applicants")}
        >
          Applicants
        </SidebarButton>
        <SidebarButton
          isSelected={atRoles}
          onClick={() => redirectMeTo("/roles")}
        >
          Roles
        </SidebarButton>
      </Wrapper>
    </>
  );
}

export default Sidebar;
