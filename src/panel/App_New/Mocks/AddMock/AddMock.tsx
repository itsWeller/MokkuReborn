import {
  Button,
  createStyles,
  Flex,
  SegmentedControl,
  Tabs,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";
import { v4 as uuidv4 } from "uuid";
import React from "react";
import { SideDrawer } from "../../Blocks/SideDrawer";
import {
  IMockResponseRaw,
  IMockResponse,
  MethodEnum,
  MockStatusEnum,
} from "../../types";
import { useForm } from "@mantine/form";
import { MdClose, MdDeleteOutline } from "react-icons/md";
import * as storeService from "../../service/store";
import { useMockStore, useMockStoreState } from "../../store/useMockStore";
import { notifications } from "@mantine/notifications";

const useStyles = createStyles((theme) => ({
  flexGrow: {
    flexGrow: 2,
  },
  wrapper: {
    padding: 12,
    height: "100%",
    overflow: "auto",
    paddingTop: 0,
  },
  tabs: {
    flexGrow: 2,
    display: "flex",
    flexDirection: "column",
  },
  footer: {
    padding: 12,
    borderTop: `1px solid ${theme.colors.gray[2]}`,
  },
  header: {
    borderBottom: `2px solid ${theme.colors.gray[3]}`,
    paddingRight: 4,
    paddingLeft: 8,
    height: 50,
  },
}));

const useMockStoreSelector = (state: useMockStoreState) => ({
  store: state.store,
  selectedMock: state.selectedMock,
  setSearch: state.setSearch,
  setSelectedMock: state.setSelectedMock,
  setStoreProperties: state.setStoreProperties,
});

export const AddMock = () => {
  const {
    store,
    selectedMock,
    setSelectedMock,
    setStoreProperties,
  } = useMockStore(useMockStoreSelector);

  const {
    classes: { flexGrow, wrapper, tabs, footer, header },
  } = useStyles();

  const form = useForm<IMockResponseRaw>({
    initialValues: {
      headers: [],
      status: 200,
      delay: 500,
      method: "GET",
      ...selectedMock,
    },
  });
  const isNewMock = !selectedMock.id;

  return (
    <SideDrawer>
      <form
        style={{ height: "100%" }}
        onSubmit={form.onSubmit((values) => {
          if (!values.id) {
            values.id = uuidv4();
          }

          const updatedStore = isNewMock
            ? storeService.addMocks(store, values as IMockResponse)
            : storeService.updateMocks(store, values as IMockResponse);

          storeService
            .updateStoreInDB(updatedStore)
            .then(setStoreProperties)
            .then(() => {
              setSelectedMock();
              notifications.show({
                title: `${values.name} mock ${isNewMock ? "added" : "updated"}`,
                message: `Mock "${values.name}" has been ${
                  isNewMock ? "added" : "updated"
                }.`,
              });
            })
            .catch(() => {
              notifications.show({
                title: `Cannot ${isNewMock ? "add" : "update"} mock.`,
                message: `Something went wrong, unable to ${
                  isNewMock ? "add" : "update"
                } new mock.`,
                color: "red",
              });
            });
        })}
      >
        <Flex direction="column" style={{ height: "100%" }}>
          <Flex justify="space-between" align="center" className={header}>
            <Title order={6}>{isNewMock ? "Add Mock" : "Update Mock"}</Title>
            <MdClose
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedMock()}
            />
          </Flex>
          <Flex direction="column" gap={16} className={wrapper}>
            <Flex gap={12} align="center">
              <Flex direction="column">
                <Text fw={500} fz="sm">
                  Status
                </Text>
                <SegmentedControl
                  value={
                    form.values.active
                      ? MockStatusEnum.ACTIVE
                      : MockStatusEnum.INACTIVE
                  }
                  onChange={(value) =>
                    form.setFieldValue(
                      "active",
                      value === MockStatusEnum.ACTIVE,
                    )
                  }
                  size="xs"
                  data={[
                    { label: "Active", value: MockStatusEnum.ACTIVE },
                    { label: "Inactive", value: MockStatusEnum.INACTIVE },
                  ]}
                />
              </Flex>
              <TextInput
                required
                label="Name"
                placeholder="Goals Success"
                className={flexGrow}
                {...form.getInputProps("name")}
              />
            </Flex>
            <Flex gap={12} align="center">
              <Textarea
                className={flexGrow}
                label="Description"
                placeholder="Success case for goals API"
                {...form.getInputProps("description")}
              />
            </Flex>
            <Flex gap={12} align="center">
              <TextInput
                className={flexGrow}
                label="URL"
                required
                placeholder="https://api.awesomeapp.com/goals"
                {...form.getInputProps("url")}
              />
            </Flex>
            <Flex gap={12} align="center">
              <Flex direction="column">
                <Text>Method</Text>
                <SegmentedControl
                  value={form.values.method}
                  onChange={(value) =>
                    form.setFieldValue("method", value as MethodEnum)
                  }
                  size="xs"
                  data={[
                    { label: "GET", value: MethodEnum.GET },
                    { label: "POST", value: MethodEnum.POST },
                    { label: "PUT", value: MethodEnum.PUT },
                    { label: "PATCH", value: MethodEnum.PATCH },
                    { label: "DELETE", value: MethodEnum.DELETE },
                  ]}
                />
              </Flex>
              <TextInput
                required
                label="Status"
                type="number"
                placeholder="200"
                {...form.getInputProps("status")}
              />
              <TextInput
                required
                label="Delay (ms)"
                placeholder="500"
                type="number"
                {...form.getInputProps("delay")}
              />
            </Flex>
            <Flex className={flexGrow}>
              <Tabs defaultValue="headers" className={tabs}>
                <Tabs.List>
                  <Tabs.Tab value="body">Response Body</Tabs.Tab>
                  <Tabs.Tab value="headers">Response Headers</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="body" pt="xs" className={flexGrow}>
                  <JSONInput
                    id="a_unique_id"
                    value={JSON.parse(form.values?.response || "{}")}
                    onChange={({ error, jsObject }) => {
                      if (!error) {
                        form.setFieldValue(
                          "response",
                          JSON.stringify(jsObject),
                        );
                      }
                    }}
                    locale={locale}
                    height="550px"
                  />
                </Tabs.Panel>

                <Tabs.Panel value="headers" pt="xs">
                  <Button
                    variant="subtle"
                    style={{ marginBottom: 8 }}
                    onClick={() => {
                      form.insertListItem(
                        "headers",
                        {
                          name: "",
                          value: "",
                        },
                        0,
                      );
                    }}
                  >
                    + Add Header
                  </Button>
                  <Flex gap={8} direction="column">
                    {form.values.headers?.map((_, index) => (
                      <Flex gap={12} align="center" key={index}>
                        <TextInput
                          placeholder="Name"
                          className={flexGrow}
                          {...form.getInputProps(`headers.${index}.name`)}
                        />
                        <TextInput
                          placeholder="Value"
                          className={flexGrow}
                          {...form.getInputProps(`headers.${index}.value`)}
                        />
                        <MdDeleteOutline
                          onClick={() => {
                            form.removeListItem("headers", index);
                          }}
                        />
                      </Flex>
                    ))}
                  </Flex>
                </Tabs.Panel>
              </Tabs>
            </Flex>
          </Flex>
          <Flex className={footer} justify="flex-end" gap={4}>
            <Button
              color="red"
              compact
              onClick={() => setSelectedMock(undefined)}
            >
              Close
            </Button>
            <Button compact type="submit">
              {isNewMock ? "Add Mock" : "Update Mock"}
            </Button>
          </Flex>
        </Flex>
      </form>
    </SideDrawer>
  );
};
