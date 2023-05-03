import React, { useEffect, useState } from "react";
import {
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
} from "@mantine/core";
import { useViewStore, ViewEnum } from "./store/useViewStore";
import { Show } from "./Blocks/Show";
import { Mocks } from "./Mocks/Mocks";
import { Logs } from "./Logs/Logs";
import { usePanelListener } from "./hooks/usePanelListner";
import { DisabledPlaceholder } from "./DisabledPlaceholder/DisabledPlaceholder";

export interface IAppProps {
  host: string;
  tab: chrome.tabs.Tab;
  active: boolean;
  storeKey: string;
}

export const App = (props: IAppProps) => {
  const state = usePanelListener(props);
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      setTimeout(() => {
        window.location.reload();
      }, 7000);
    }
  }, []);

  if (!state.active) {
    return (
      <DisabledPlaceholder active={props.active} storeKey={props.storeKey} />
    );
  }

  const view = useViewStore((state) => state.view);
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <Show if={view === ViewEnum.MOCKS}>
          <Mocks />
        </Show>
        <Show if={view === ViewEnum.LOGS}>
          <Logs />
        </Show>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};