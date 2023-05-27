import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { styled } from "styled-components";
import colorPallete from "../utils/colorPallete.json";

function Root() {
  const Page = styled.div`
    position: absolute;
    left: 0%;
    top: 0%;
    width: 100%;
    height: 100%;
    display: flex;
    background-color: ${colorPallete.background};
  `;

  const SidebarPosition = styled.div`
    width: 15%;
    height: 100%;
  `;

  return (
    <>
      <Page>
        <SidebarPosition>
          <Sidebar />
        </SidebarPosition>
        <Outlet />
      </Page>
    </>
  );
}

export default Root;
