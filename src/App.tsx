import {
  Button,
  Checkbox,
  Collapse,
  Form,
  Input,
  PageHeader,
  Space,
  Table,
  Tag,
} from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useEffect, useMemo, useReducer, useState } from "react";
import {
  AbstractControl,
  FieldControl,
  FieldGroup,
  FormBuilder,
  FormGroup,
  Validators,
} from "react-reactive-form";
import Switch from "./components/Switch";

const accordionStatus = {
  basicInfo: false,
  extraInfo: false,
  bases: false,
};

const reducer = (state: any, action: any) => {
  state[action.type] = action.value;
  return { ...state };
};

const tableValidator = (control: AbstractControl) => {
  if (control.value.length <= 0) {
    return {
      length: true,
      message: "The table needs at least one row!",
    };
  }
  return null;
};

const testeValidator = (control: AbstractControl) => {
  console.log("testeValidator", control.value);
  return null;
};

function App() {
  const [allValid, setAllValid] = useState(false);
  const loginForm = useMemo(() => {
    return FormBuilder.group({
      username: ["", [Validators.required, Validators.minLength(3)]],
      password: ["", Validators.required],
      status: [true],
      rememberMe: false,
    });
  }, []);
  const extraInfoForm = useMemo(() => {
    return FormBuilder.group({
      extraInfoName: ["", []],
      table: [[], [tableValidator]],
    });
  }, []);
  const basesInfoForm = useMemo(() => {
    return FormBuilder.group({
      basesInfoName: ["", []],
      basesInfo: [
        FormBuilder.array([
          // FormBuilder.group({
          //   bName: ["", []],
          // })
        ]),
        [testeValidator],
      ],
    });
  }, []);

  const extraInfoColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: any) => <span>{text}</span>,
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Tags",
      key: "tags",
      dataIndex: "tags",
      render: (_: any, { tags }: any) => (
        <>
          {tags.map((tag: any) => {
            let color = tag.length > 5 ? "geekblue" : "green";
            if (tag === "loser") {
              color = "volcano";
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <Space size="middle">
          <span>Invite {record.name}</span>
          <span>Delete</span>
        </Space>
      ),
    },
  ];

  const [state, dispatch] = useReducer(reducer, accordionStatus);

  useEffect(() => {
    setAllValid(state.basicInfo && state.extraInfo && state.bases);
  }, [state]);

  return (
    <div>
      <div className="site-page-header-ghost-wrapper">
        <PageHeader
          ghost={false}
          // onBack={() => window.history.back()}
          onBack={() => null}
          title="Title"
          subTitle="This is a subtitle"
          extra={[
            <Button type="link" key="3">
              Link
            </Button>,
            <Button key="2">Operation</Button>,
            <Button key="1" type="primary" disabled={!allValid}>
              Finalizar
            </Button>,
          ]}
        />
      </div>
      <Collapse
        defaultActiveKey={["3"]}
        // onChange={(e) => {
        //   console.log(e);
        //   if (!e.includes("1")) {
        //     // dispatch({ type: "basicInfo", value: loginForm.valid });
        //     console.log("Form values", loginForm.value);
        //   }
        // }}
      >
        <Collapse.Panel
          header="Dados"
          key="1"
          extra={
            state.basicInfo && (
              <CheckCircleOutlined style={{ color: "green", fontSize: 24 }} />
            )
          }
        >
          <FieldGroup
            control={loginForm}
            render={({ get, invalid }) => {
              return (
                <Form
                  onFinish={(e) => {
                    // e.preventDefault();
                    // console.log(e);
                    console.log("Form values", loginForm.value);
                  }}
                  onChange={(e) => {
                    dispatch({ type: "basicInfo", value: !invalid });
                    // console.log("Form values", loginForm.value);
                  }}
                  // onBlur={(e) => {
                  //   console.log(e);
                  // }}
                >
                  <FieldControl
                    name="username"
                    render={(e) => {
                      return (
                        <div>
                          <label htmlFor="userName">{e.meta.label}</label>
                          <Input
                            id="userName"
                            placeholder={`Enter ${e.meta.label}`}
                            {...e.handler()}
                          />
                          <span>
                            {e.touched &&
                              (e.hasError("required") ||
                                e.hasError("minLength")) &&
                              `${e.meta.label} is required`}
                          </span>
                        </div>
                      );
                    }}
                    meta={{ label: "Username", type: "text" }}
                  />

                  <FieldControl
                    name="password"
                    render={(e) => {
                      return (
                        <div>
                          <label htmlFor="pass">{e.meta.label}</label>
                          <Input.Password
                            id="pass"
                            placeholder={`Enter ${e.meta.label}`}
                            {...e.handler()}
                            type={e.meta.type}
                          />
                          <span>
                            {e.touched &&
                              e.hasError("required") &&
                              `${e.meta.label} is required`}
                          </span>
                        </div>
                      );
                    }}
                    meta={{ label: "Password", type: "password" }}
                  />

                  <FieldControl
                    name="rememberMe"
                    render={(e) => {
                      return (
                        <div>
                          <Checkbox {...e.handler("checkbox")}>
                            Remember me
                          </Checkbox>
                        </div>
                      );
                    }}
                  />

                  <FieldControl
                    name="status"
                    render={(e) => {
                      const { value, onChange, disabled } = e.handler();
                      return (
                        <Switch
                          leftText="Inativo"
                          rightText="Ativo"
                          checked={value}
                          onChange={onChange}
                          disabled={disabled}
                        />
                      );
                    }}
                  />
                  <Button
                    type="dashed"
                    onClick={() => {
                      loginForm.reset();
                      dispatch({ type: "basicInfo", value: false });
                    }}
                  >
                    Reset
                  </Button>
                  <Button htmlType="submit" type="primary" disabled={invalid}>
                    Submit
                  </Button>
                </Form>
              );
            }}
          />
          <Button
            onClick={() => {
              if (loginForm.valid) {
                console.log(loginForm.value);
                dispatch({ type: "basicInfo", value: true });
              } else {
                dispatch({ type: "basicInfo", value: false });
              }
            }}
          >
            New submit
          </Button>
        </Collapse.Panel>
        <Collapse.Panel
          header="Informações Extras"
          key="2"
          extra={
            state.extraInfo && (
              <CheckCircleOutlined style={{ color: "green", fontSize: 24 }} />
            )
          }
        >
          <FieldGroup
            control={extraInfoForm}
            render={({ get, invalid }) => {
              return (
                <Form
                  onFinish={(e) => {
                    extraInfoForm.controls.table.setValue([
                      ...extraInfoForm.controls.table.value,
                      {
                        key: extraInfoForm.controls.table.value.length.toString(),
                        name: extraInfoForm.controls.extraInfoName.value,
                        age: 32,
                        address: "New York No. 1 Lake Park",
                        tags: ["nice", "developer"],
                      },
                    ]);
                    extraInfoForm.controls.extraInfoName.reset();
                    dispatch({ type: "extraInfo", value: !invalid });
                  }}
                  // onChange={() => {
                  //   dispatch({ type: "extraInfo", value: !invalid });
                  // }}
                >
                  <Space size="middle">
                    <FieldControl
                      name="extraInfoName"
                      meta={{ label: "Name", type: "text" }}
                      render={(e) => {
                        console.log(e);
                        return (
                          <div>
                            <label htmlFor="extraInfoName">
                              {e.meta.label}
                            </label>
                            <Input id="extraInfoName" {...e.handler()} />
                          </div>
                        );
                      }}
                    />

                    <Button type="primary" htmlType="submit">
                      Incluir
                    </Button>
                  </Space>

                  <FieldControl
                    name="table"
                    meta={{ label: "Table", type: "table" }}
                    render={(e) => {
                      const { value } = e.handler();
                      return (
                        <>
                          {/* <Space size="middle">
                            <div>
                              <label htmlFor="extraInfoName"></label>
                              <Input id="extraInfoName" />
                            </div>
                            <div>
                              <label htmlFor="extraInfoAge"></label>
                              <Input id="extraInfoAge" type="number" />
                            </div>
                            <div>
                              <label htmlFor="extraInfoAddress"></label>
                              <Input id="extraInfoAddress" />
                            </div>
                            <Button
                              type="primary"
                              // onClick={() => {
                              // }}
                            >
                              Incluir
                            </Button>
                          </Space> */}
                          <Table
                            columns={extraInfoColumns}
                            rowKey="key"
                            dataSource={value}
                            pagination={{
                              position: ["bottomCenter"],
                              pageSize: 5,
                              showTotal: (total) => {
                                return `Total de ${total} itens`;
                              },
                            }}
                            locale={{
                              emptyText: "Nenhum registro encontrado",
                            }}
                          />
                        </>
                      );
                    }}
                  />
                </Form>
              );
            }}
          />
        </Collapse.Panel>
        <Collapse.Panel header="Bases" key="3">
          <FieldGroup
            control={basesInfoForm}
            render={({ get, invalid }) => {
              return (
                <Form
                  onFinish={() => {
                    const addressForm = FormBuilder.group({
                      cep: [null, [Validators.required]],
                      street: [null, [Validators.required]],
                      number: [null, [Validators.required]],
                    });
                    const contactForm = FormBuilder.group({
                      email: [null, []],
                      list: [[], [tableValidator]],
                    });
                    const rav = FormBuilder.group({
                      transport: [null, []],
                      list: [[], [tableValidator]],
                    });
                    const extraForm = FormBuilder.group({
                      info: [null, []],
                      list: [[], [tableValidator]],
                    });
                    basesInfoForm.controls.basesInfo.setValue(
                      FormBuilder.array([
                        ...basesInfoForm.controls.basesInfo.value.controls,
                        FormBuilder.group({
                          bName: [
                            basesInfoForm.controls.basesInfoName.value,
                            [],
                          ],
                          bAddress: [addressForm, []],
                          bContact: [contactForm, []],
                          bRoutesAndValues: [rav, []],
                          bExtraInfo: [extraForm, []],
                        }),
                      ])
                    );
                    console.log(basesInfoForm.controls.basesInfo.value);
                    basesInfoForm.controls.basesInfoName.reset();
                    // console.log(basesInfoForm.getRawValue());
                    dispatch({ type: "bases", value: !invalid });
                  }}
                  // onChange={() => {
                  //   dispatch({ type: "bases", value: !invalid });
                  // }}
                >
                  <Space size="middle">
                    <FieldControl
                      name="basesInfoName"
                      meta={{ label: "Nome da base", type: "text" }}
                      render={(e) => {
                        return (
                          <div>
                            <label htmlFor="basesInfoName">
                              {e.meta.label}
                            </label>
                            <Input id="basesInfoName" {...e.handler()} />
                          </div>
                        );
                      }}
                    />

                    <Button type="primary" htmlType="submit">
                      Incluir
                    </Button>
                  </Space>

                  {basesInfoForm.controls.basesInfo.value.controls.map(
                    (bControl: FormGroup, index: number) => {
                      return (
                        <Collapse key={`${index + 1}`}>
                          <Collapse.Panel
                            header={`Base: ${bControl.controls.bName.value}`}
                            key={`${index + 1}`}
                            extra={
                              state.basicInfo && (
                                <CheckCircleOutlined
                                  style={{ color: "green", fontSize: 24 }}
                                />
                              )
                            }
                          >
                            {bControl.controls.bName.value}
                          </Collapse.Panel>
                        </Collapse>
                      );
                    }
                  )}
                </Form>
              );
            }}
          />
        </Collapse.Panel>
      </Collapse>
    </div>
  );
}

export default App;
