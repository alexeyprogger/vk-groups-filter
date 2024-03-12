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
  Panel,
  PanelHeader,
  Select,
  Spinner,
} from "@vkontakte/vkui";
import {
  Icon28SunOutline,
  Icon28MoonOutline,
  Icon32LogoVkColor,
} from "@vkontakte/icons";

interface Filter {
  privFilter: "0" | "1" | "все";
  avatarFilter:
    | "все"
    | "red"
    | "green"
    | "yellow"
    | "blue"
    | "purple"
    | "white"
    | "orange";
  friendsFilter: "0" | "1" | "все";
}

function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [appearance, setAppearance] = useState<"dark" | "light">("light");
  const [filter, setFilter] = useState<Filter>({
    privFilter: "все",
    avatarFilter: "все",
    friendsFilter: "все",
  });

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
    const { value, name } = e.target;
    switch (name) {
      case "avatarFilter":
        setFilter((prev) => ({
          ...prev,
          [name]: value as Filter["avatarFilter"],
        }));

        setFilteredData(
          data.filter(
            (item) =>
              (filter.friendsFilter == "все"
                ? true
                : !!item["friends"] == !!Number(filter.friendsFilter)) &&
              (filter.privFilter == "все"
                ? true
                : item["closed"] == Boolean(Number(filter.privFilter))) &&
              (value == "все" ? true : item["avatar_color"] == value)
          )
        );
        break;
      case "privFilter":
        setFilter((prev) => ({
          ...prev,
          [name]: value as Filter["privFilter"],
        }));

        setFilteredData(
          data.filter(
            (item) =>
              (filter.friendsFilter == "все"
                ? true
                : !!item["friends"] == !!Number(filter.friendsFilter)) &&
              (filter.avatarFilter != "все"
                ? item["avatar_color"] == filter.avatarFilter
                : true) &&
              (value == "все" ? true : item["closed"] == !!Number(value))
          )
        );
        break;
      case "friendsFilter":
        setFilter((prev) => ({
          ...prev,
          [name]: value as Filter["friendsFilter"],
        }));

        setFilteredData(
          data.filter(
            (item) =>
              (value == "все" ? true : !!item["friends"] == !!Number(value)) &&
              (filter.avatarFilter != "все"
                ? item["avatar_color"] == filter.avatarFilter
                : true) &&
              (filter.privFilter == "все"
                ? true
                : item["closed"] == !!Number(filter.privFilter))
          )
        );
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
                  name="privFilter"
                  value={filter.privFilter}
                  onChange={privChange}
                  options={[
                    { label: "Закрытые", value: "1" },
                    { label: "Открытые", value: "0" },
                    { label: "Все", value: "все" },
                  ]}
                />
              </FormItem>
              <FormItem top="Тип аватара">
                <Select
                  name="avatarFilter"
                  value={filter.avatarFilter}
                  onChange={privChange}
                  options={[
                    { label: "Все", value: "все" },
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
                  name="friendsFilter"
                  value={filter.friendsFilter}
                  onChange={privChange}
                  options={[
                    { label: "Все", value: "все" },
                    { label: "Состоят друзья", value: "1" },
                    { label: "Без друзей", value: "0" },
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
