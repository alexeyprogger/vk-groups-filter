import { Example } from "./components/GroupCard";
import { ErrorPage } from "./components/ErrorPage";
import { useState, useEffect, ChangeEvent } from "react";

import "./App.css";
import axios from "axios";
import {
  AdaptivityProvider,
  AppRoot,
  ConfigProvider,
  FormItem,
  FormLayoutGroup,
  Group,
  Panel,
  PanelHeader,
  PanelHeaderButton,
  Search,
  Select,
  Spinner,
  VisuallyHidden,
} from "@vkontakte/vkui";
import {
  Icon28SunOutline,
  Icon28MoonOutline,
  Icon32LogoVkColor,
} from "@vkontakte/icons";
import React from "react";

function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [appearance, setAppearance] = useState<"dark" | "light">("light");
  const [privFilter, setPrivFilter] = useState("все");
  const [avatarFilter, setAvatarFilter] = useState("все");
  const [friendsFilter, setFriendsFilter] = useState("все");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const getData = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/groups`);
      setData(res.data);
      setFilteredData(res.data);
      setLoading(false);
      console.log(res);
    } catch (e) {
      setError(true);
    }
  };

  useEffect(() => {
    setTimeout(getData, 1000); // Реализация задержки обработки запросов на бэкенде
  }, []);

  const privChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setPrivFilter(e.target.value);
    setAvatarFilter("все");
    setAvatarFilter("все");
    e.target.value == "все"
      ? setFilteredData(data)
      : setFilteredData(
          data.filter(
            (item) => item["closed"] == Boolean(Number(e.target.value))
          )
        );
  };
  const avatarChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setFriendsFilter("все");
    setPrivFilter("все");
    setAvatarFilter(e.target.value);
    console.log(avatarFilter);

    e.target.value == "без аватара"
      ? setFilteredData(
          data.filter((item) => item["avatar_color"] == undefined)
        )
      : e.target.value == "все"
      ? setFilteredData(data)
      : setFilteredData(
          data.filter((item) => item["avatar_color"] == e.target.value)
        );
  };
  const friendsChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setFriendsFilter(e.target.value);
    setAvatarFilter("все");
    setPrivFilter("все");
    switch (e.target.value) {
      case "все":
        setFilteredData(data);
        break;
      case "друзья":
        setFilteredData(data.filter((item) => item["friends"] != undefined));
        break;
      case "нет":
        setFilteredData(data.filter((item) => item["friends"] == undefined));
        break;
    }
  };

  return error ? (
    <ErrorPage />
  ) : (
    <ConfigProvider appearance={appearance}>
      <AdaptivityProvider>
        <AppRoot>
          <Panel>
            <PanelHeader>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                Список групп: {filteredData.length}
                <Icon32LogoVkColor />
                <a href="https://vk.com">vk.com</a>
                {appearance === "dark" ? (
                  <Icon28SunOutline onClick={() => setAppearance("light")} />
                ) : (
                  <Icon28MoonOutline onClick={() => setAppearance("dark")} />
                )}
              </div>
            </PanelHeader>
            <FormLayoutGroup
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
              }}
            >
              <FormItem top="Приватность">
                <Select
                  value={privFilter}
                  onChange={privChange}
                  options={[
                    { label: "Все", value: "все" },
                    { label: "Закрытые", value: "1" },
                    { label: "Открытые", value: "0" },
                  ]}
                />
              </FormItem>
              <FormItem top="Тип аватара">
                <Select
                  value={avatarFilter}
                  onChange={avatarChange}
                  options={[
                    { label: "Все", value: "все" },
                    { label: "Без аватара", value: "без аватара" },
                    { label: "Красный", value: "red" },
                    { label: "Зелёный", value: "green" },
                    { label: "Жёлтый", value: "yellow" },
                    { label: "Синий", value: "blue" },
                    { label: "Фиолетовый", value: "purple" },
                    { label: "Белый", value: "white" },
                    { label: "Оранжевый", value: "orange" },
                  ]}
                />
              </FormItem>
              <FormItem top="Наличие друзей">
                <Select
                  value={friendsFilter}
                  onChange={friendsChange}
                  options={[
                    { label: "Все группы", value: "все" },
                    { label: "Состоят друзья", value: "друзья" },
                    { label: "Без друзей", value: "нет" },
                  ]}
                />
              </FormItem>
            </FormLayoutGroup>
            {loading ? (
              <Spinner size="large" style={{ margin: "20px 0" }} />
            ) : (
              filteredData.map((item) => (
                <Example
                  key={item["id"]}
                  name={item["name"]}
                  closed={item["closed"]}
                  members_count={item["members_count"]}
                  avatar_color={item["avatar_color"]}
                  friends={item["friends"]}
                />
              ))
            )}
          </Panel>
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  );
}

export default App;
