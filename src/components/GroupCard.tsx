import { useState } from "react";
import {
  Group,
  Header,
  Panel,
  PanelHeaderBack,
  SimpleCell,
  View,
  Cell,
} from "@vkontakte/vkui";

import { Icon28Users3, Icon28IncognitoCircleFillGray } from "@vkontakte/icons";

import "@vkontakte/vkui/dist/vkui.css";
type Props = {
  name: string;
  closed: boolean;
  members_count: number;
  avatar_color?: string;
  friends?: User[];
};

type User = {
  first_name: string;
  last_name: string;
};

export const Example = ({
  name,
  closed,
  members_count,
  avatar_color,
  friends,
}: Props) => {
  const [activePanel, setActivePanel] = useState("panel1");
  return (
    <div
      style={{
        display: "flex",
        gridTemplateColumns: "repeat(6, 1fr)",
      }}
    >
      <View activePanel={activePanel}>
        <Panel id="panel1">
          <Group header={<Header mode="secondary">{name}</Header>}>
            <div
              className="side_bar"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
              }}
            >
              <SimpleCell>
                {avatar_color ? (
                  <div
                    className="circle"
                    style={{ background: `${avatar_color}` }}
                  ></div>
                ) : (
                  <img src="empt_avatar.png" className="circle" />
                )}
              </SimpleCell>
              <SimpleCell before={<Icon28IncognitoCircleFillGray />}>
                {closed ? "Закрытая группа" : "Открытая группа"}
              </SimpleCell>
              <SimpleCell before={<Icon28Users3 />}>
                {`Участников: ${members_count}`}
              </SimpleCell>
              {friends && (
                <SimpleCell
                  onClick={() => setActivePanel("panel2")}
                  before={<Icon28Users3 />}
                >
                  {`Друзья: ${friends.length}`}
                </SimpleCell>
              )}
            </div>
          </Group>
        </Panel>
        <Panel id="panel2">
          <Group>
            <div style={{ display: "flex" }}>
              <PanelHeaderBack onClick={() => setActivePanel("panel1")} />
              <p>Ваши друзья, состоящие в группе "{name}"</p>
            </div>
            {friends?.map((e) => (
              <Cell>
                {e.first_name} {e.last_name}
              </Cell>
            ))}
          </Group>
        </Panel>
      </View>
    </div>
  );
};
