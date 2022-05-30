import {
  Button,
  Checkbox,
  Collapse,
  Form,
  Input,
  PageHeader,
  Select,
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

const editMode = true;
const readMode = false;
const createMode = !editMode && !readMode;

const mockedData = {
  id: "1",
  loginForm: {
    username: "123",
    password: "123",
    status: true,
    rememberMe: false,
  },
  extraInfoForm: [
    {
      key: "0",
      name: "1",
      age: 32,
      address: "New York No. 1 Lake Park",
      tags: ["nice", "developer"],
    },
  ],
  basesInfoForm: [
    {
      bName: "1",
      bAddress: {
        cep: "1",
        street: "2",
        number: "3",
      },
      bContact: [
        {
          email: "1",
          id: 0,
        },
      ],
      bRoutesAndValues: [
        {
          transport: "Yiminghe",
          id: 0,
        },
      ],
      bExtraInfo: [
        {
          info: "1",
          id: 0,
        },
      ],
    },
    {
      bName: "2",
      bAddress: {
        cep: "3",
        street: "2",
        number: "1",
      },
      bContact: [
        {
          email: "teste@teste.com",
          id: 0,
        },
      ],
      bRoutesAndValues: [
        {
          transport: "lucy",
          id: 0,
        },
      ],
      bExtraInfo: [
        {
          info: "1",
          id: 0,
        },
      ],
    },
  ],
};

const accordionStatus = {
  basicInfo: false,
  extraInfo: false,
  bases: [],
};

const reducer = (state: any, action: any) => {
  if (action.type === "fill") {
    state = {
      basicInfo: true,
      extraInfo: true,
      bases: action.bases.map(() => {
        return {
          addressForm: true,
          contactForm: true,
          rav: true,
          extraForm: true,
        };
      }),
    };
  } else if (action.type !== "bases") {
    state[action.type] = action.value;
  } else {
    switch (action.subType) {
      case "new":
        state[action.type][action.index] = action.value;
        break;
      default:
        state[action.type][action.index][action.subType] = action.value;
        break;
    }
  }
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
        [],
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

  const [accordionsState, accordionDispatch] = useReducer(
    reducer,
    accordionStatus
  );

  useEffect(() => {
    setAllValid(
      accordionsState.basicInfo &&
        accordionsState.extraInfo &&
        accordionsState.bases.length > 0 &&
        accordionsState.bases.every((el: any) => {
          return el.addressForm && el.contactForm && el.rav && el.extraForm;
        })
    );
  }, [accordionsState]);

  useEffect(() => {
    if (editMode || readMode) {
      if (readMode) {
        loginForm.disable();
        extraInfoForm.disable();
        basesInfoForm.disable();
      }
      loginForm.patchValue(mockedData.loginForm);
      extraInfoForm.patchValue({
        table: mockedData.extraInfoForm,
      });
      basesInfoForm.patchValue({
        basesInfo: FormBuilder.array(
          mockedData.basesInfoForm.map((b) => {
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
            addressForm.patchValue(b.bAddress);
            contactForm.patchValue({
              list: b.bContact,
            });
            rav.patchValue({
              list: b.bRoutesAndValues,
            });
            extraForm.patchValue({
              list: b.bExtraInfo,
            });

            if (readMode) {
              addressForm.disable();
              contactForm.disable();
              rav.disable();
              extraForm.disable();
            }

            return FormBuilder.group({
              bName: [b.bName, []],
              bAddress: [addressForm, []],
              bContact: [contactForm, []],
              bRoutesAndValues: [rav, []],
              bExtraInfo: [extraForm, []],
            });
          })
        ),
      });
      accordionDispatch({
        type: "fill",
        bases: mockedData.basesInfoForm,
      });
    }
  }, []);

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
            <Button
              key="1"
              type="primary"
              disabled={!allValid}
              onClick={() => {
                console.log("allValid", allValid);
                console.log("loginForm", loginForm.value);
                console.log("extraInfoForm", extraInfoForm.value);
                console.log(
                  "basesInfoForm",
                  basesInfoForm.value.basesInfo.value.map((b: any) => {
                    return {
                      bName: b.bName,
                      bAddress: b.bAddress.value,
                      bContact: b.bContact.value,
                      bRav: b.bRoutesAndValues.value,
                      bExtra: b.bExtraInfo.value,
                    };
                  })
                );
              }}
            >
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
        {/* Dados */}
        <Collapse.Panel
          header="Dados"
          key="1"
          extra={
            accordionsState.basicInfo && (
              <CheckCircleOutlined style={{ color: "green", fontSize: 24 }} />
            )
          }
        >
          <FieldGroup
            control={loginForm}
            render={({ get, invalid, disabled }) => {
              return (
                <Form
                  onFinish={(e) => {
                    // e.preventDefault();
                    // console.log(e);
                    console.log("Form values", loginForm.value);
                  }}
                  onChange={(e) => {
                    accordionDispatch({
                      type: "basicInfo",
                      value: loginForm.valid,
                    });
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

                  {!disabled && (
                    <>
                      <Button
                        type="dashed"
                        onClick={() => {
                          loginForm.reset();
                          accordionDispatch({
                            type: "basicInfo",
                            value: false,
                          });
                        }}
                      >
                        Reset
                      </Button>
                      <Button
                        htmlType="submit"
                        type="primary"
                        disabled={invalid}
                      >
                        Submit
                      </Button>
                    </>
                  )}
                </Form>
              );
            }}
          />
          {!readMode && (
            <Button
              onClick={() => {
                if (loginForm.valid) {
                  console.log(loginForm.value);
                  accordionDispatch({ type: "basicInfo", value: true });
                } else {
                  accordionDispatch({ type: "basicInfo", value: false });
                }
              }}
            >
              New submit
            </Button>
          )}
        </Collapse.Panel>
        {/* Informações Extras */}
        <Collapse.Panel
          header="Informações Extras"
          key="2"
          extra={
            accordionsState.extraInfo && (
              <CheckCircleOutlined style={{ color: "green", fontSize: 24 }} />
            )
          }
        >
          <FieldGroup
            control={extraInfoForm}
            render={({ get, invalid, disabled }) => {
              console.log(disabled);

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
                    accordionDispatch({
                      type: "extraInfo",
                      value: extraInfoForm.valid,
                    });
                  }}
                >
                  {!disabled && (
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
                  )}

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
        {/* Bases */}
        <Collapse.Panel
          header="Bases"
          key="3"
          extra={
            accordionsState.bases.length > 0 &&
            accordionsState.bases.every((el: any) => {
              return el.addressForm && el.contactForm && el.rav && el.extraForm;
            }) && (
              <CheckCircleOutlined style={{ color: "green", fontSize: 24 }} />
            )
          }
        >
          <FieldGroup
            control={basesInfoForm}
            render={({ get, invalid, disabled }) => {
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
                    const bIndex =
                      basesInfoForm.controls.basesInfo.value.controls.length;
                    basesInfoForm.controls.basesInfo.setValue(
                      FormBuilder.array([
                        ...basesInfoForm.controls.basesInfo.value.controls,
                        FormBuilder.group({
                          bName: [
                            basesInfoForm.controls.basesInfoName.value,
                            [],
                          ],
                          bAddress: [addressForm, [testeValidator]],
                          bContact: [contactForm, []],
                          bRoutesAndValues: [rav, []],
                          bExtraInfo: [extraForm, []],
                        }),
                      ])
                    );
                    // console.log(basesInfoForm.controls.basesInfo.value);
                    basesInfoForm.controls.basesInfoName.reset();
                    accordionDispatch({
                      type: "bases",
                      index: bIndex,
                      subType: "new",
                      value: {
                        addressForm: false,
                        contactForm: false,
                        rav: false,
                        extraForm: false,
                      },
                    });
                  }}
                  // onChange={() => {
                  //   dispatch({ type: "bases", value: !invalid });
                  // }}
                >
                  {!disabled && (
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
                  )}
                </Form>
              );
            }}
          />
          {basesInfoForm.controls.basesInfo.value.controls.map(
            (bControl: FormGroup, index: number) => {
              return (
                // Collapse da Base
                <Collapse key={`${index + 1}`}>
                  {/* Painel da Base */}
                  <Collapse.Panel
                    header={`Base: ${bControl.controls.bName.value}`}
                    key={`${index + 1}`}
                    extra={
                      accordionsState.bases[index].addressForm &&
                      accordionsState.bases[index].contactForm &&
                      accordionsState.bases[index].rav &&
                      accordionsState.bases[index].extraForm && (
                        <CheckCircleOutlined
                          style={{ color: "green", fontSize: 24 }}
                        />
                      )
                    }
                  >
                    {/* Collapse dos sub itens */}
                    <Collapse>
                      {/* Endereço */}
                      <Collapse.Panel
                        header="Endereço"
                        key="1"
                        extra={
                          accordionsState.bases[index].addressForm && (
                            <CheckCircleOutlined
                              style={{ color: "green", fontSize: 24 }}
                            />
                          )
                        }
                      >
                        <FieldGroup
                          control={bControl.controls.bAddress.value}
                          render={({ get, invalid }) => {
                            return (
                              <Form
                                onChange={() => {
                                  accordionDispatch({
                                    type: "bases",
                                    index: index,
                                    subType: "addressForm",
                                    value:
                                      bControl.controls.bAddress.value.valid,
                                  });
                                }}
                              >
                                <Space size="middle">
                                  <FieldControl
                                    name="cep"
                                    meta={{
                                      label: "CEP",
                                      type: "text",
                                    }}
                                    render={(e) => {
                                      return (
                                        <div>
                                          <label htmlFor="cep">
                                            {e.meta.label}
                                          </label>
                                          <Input id="cep" {...e.handler()} />
                                        </div>
                                      );
                                    }}
                                  />
                                  <FieldControl
                                    name="street"
                                    meta={{
                                      label: "Rua",
                                      type: "text",
                                    }}
                                    render={(e) => {
                                      return (
                                        <div>
                                          <label htmlFor="street">
                                            {e.meta.label}
                                          </label>
                                          <Input id="street" {...e.handler()} />
                                        </div>
                                      );
                                    }}
                                  />
                                  <FieldControl
                                    name="number"
                                    meta={{
                                      label: "Número",
                                      type: "number",
                                    }}
                                    render={(e) => {
                                      return (
                                        <div>
                                          <label htmlFor="number">
                                            {e.meta.label}
                                          </label>
                                          <Input id="number" {...e.handler()} />
                                        </div>
                                      );
                                    }}
                                  />
                                </Space>
                              </Form>
                            );
                          }}
                        />
                      </Collapse.Panel>
                      {/* Contato */}
                      <Collapse.Panel
                        header="Contato"
                        key="2"
                        extra={
                          accordionsState.bases[index].contactForm && (
                            <CheckCircleOutlined
                              style={{ color: "green", fontSize: 24 }}
                            />
                          )
                        }
                      >
                        <FieldGroup
                          control={bControl.controls.bContact.value}
                          render={({ get, invalid, disabled }) => {
                            return (
                              <Form
                                onFinish={() => {
                                  console.log(
                                    bControl.controls.bContact.value.value
                                  );

                                  bControl.controls.bContact.value.controls.list.setValue(
                                    [
                                      ...bControl.controls.bContact.value
                                        .controls.list.value,
                                      {
                                        email:
                                          bControl.controls.bContact.value
                                            .controls.email.value,
                                        id: bControl.controls.bContact.value
                                          .controls.list.value.length,
                                      },
                                    ]
                                  );
                                  bControl.controls.bContact.value.controls.email.reset();
                                  accordionDispatch({
                                    type: "bases",
                                    index: index,
                                    subType: "contactForm",
                                    value:
                                      bControl.controls.bContact.value.valid,
                                  });
                                }}
                              >
                                {!disabled && (
                                  <Space size="middle">
                                    <FieldControl
                                      name="email"
                                      meta={{ label: "E-mail", type: "email" }}
                                      render={(e) => {
                                        return (
                                          <div>
                                            <label htmlFor="email">
                                              {e.meta.label}
                                            </label>
                                            <Input
                                              id="email"
                                              {...e.handler()}
                                            />
                                          </div>
                                        );
                                      }}
                                    />
                                    <Button type="primary" htmlType="submit">
                                      Incluir
                                    </Button>
                                  </Space>
                                )}
                                <FieldControl
                                  name="list"
                                  meta={{ label: "Lista de contatos" }}
                                  render={(e) => {
                                    const { value } = e.handler();
                                    return (
                                      <Table
                                        columns={[
                                          {
                                            title: "Id",
                                            dataIndex: "id",
                                            key: "id",
                                          },
                                          {
                                            title: "email",
                                            dataIndex: "email",
                                            key: "email",
                                          },
                                        ]}
                                        rowKey="id"
                                        dataSource={value}
                                        pagination={{
                                          position: ["bottomCenter"],
                                          pageSize: 3,
                                          showTotal: (total) => {
                                            return `Total de ${total} itens`;
                                          },
                                        }}
                                        locale={{
                                          emptyText:
                                            "Nenhum registro encontrado",
                                        }}
                                      />
                                    );
                                  }}
                                />
                              </Form>
                            );
                          }}
                        />
                      </Collapse.Panel>
                      {/* Percurso e valores */}
                      <Collapse.Panel
                        header="Percurso e valores"
                        key="3"
                        extra={
                          accordionsState.bases[index].rav && (
                            <CheckCircleOutlined
                              style={{ color: "green", fontSize: 24 }}
                            />
                          )
                        }
                      >
                        <FieldGroup
                          control={bControl.controls.bRoutesAndValues.value}
                          render={({ get, invalid, disabled }) => {
                            return (
                              <Form
                                onFinish={() => {
                                  console.log(
                                    bControl.controls.bRoutesAndValues.value
                                      .value
                                  );
                                  bControl.controls.bRoutesAndValues.value.controls.list.setValue(
                                    [
                                      ...bControl.controls.bRoutesAndValues
                                        .value.controls.list.value,
                                      {
                                        transport:
                                          bControl.controls.bRoutesAndValues
                                            .value.controls.transport.value,
                                        id: bControl.controls.bRoutesAndValues
                                          .value.controls.list.value.length,
                                      },
                                    ]
                                  );
                                  bControl.controls.bRoutesAndValues.value.controls.transport.reset();
                                  accordionDispatch({
                                    type: "bases",
                                    index: index,
                                    subType: "rav",
                                    value:
                                      bControl.controls.bRoutesAndValues.value
                                        .valid,
                                  });
                                }}
                              >
                                {!disabled && (
                                  <Space size="middle">
                                    <FieldControl
                                      name="transport"
                                      meta={{ label: "Tipo de Transporte" }}
                                      render={(e) => {
                                        return (
                                          <div
                                            style={{
                                              display: "flex",
                                              flexDirection: "column",
                                            }}
                                          >
                                            <label htmlFor="transport">
                                              {e.meta.label}
                                            </label>
                                            <Select
                                              id="transport"
                                              defaultValue="lucy"
                                              style={{ width: 120 }}
                                              // onChange={(e) => {
                                              //   console.log(e);
                                              // }}
                                              {...e.handler()}
                                            >
                                              <Select.Option value="jack">
                                                Jack
                                              </Select.Option>
                                              <Select.Option value="lucy">
                                                Lucy
                                              </Select.Option>
                                              <Select.Option
                                                value="disabled"
                                                disabled
                                              >
                                                Disabled
                                              </Select.Option>
                                              <Select.Option value="Yiminghe">
                                                yiminghe
                                              </Select.Option>
                                            </Select>
                                          </div>
                                        );
                                      }}
                                    />
                                    <Button type="primary" htmlType="submit">
                                      Incluir
                                    </Button>
                                  </Space>
                                )}
                                <FieldControl
                                  name="list"
                                  meta={{ label: "Lista de contatos" }}
                                  render={(e) => {
                                    const { value } = e.handler();
                                    return (
                                      <Table
                                        columns={[
                                          {
                                            title: "Id",
                                            dataIndex: "id",
                                            key: "id",
                                          },
                                          {
                                            title: "Tipo de Transporte",
                                            dataIndex: "transport",
                                            key: "transport",
                                          },
                                        ]}
                                        rowKey="id"
                                        dataSource={value}
                                        pagination={{
                                          position: ["bottomCenter"],
                                          pageSize: 3,
                                          showTotal: (total) => {
                                            return `Total de ${total} itens`;
                                          },
                                        }}
                                        locale={{
                                          emptyText:
                                            "Nenhum registro encontrado",
                                        }}
                                      />
                                    );
                                  }}
                                />
                              </Form>
                            );
                          }}
                        />
                      </Collapse.Panel>
                      {/* Informações Extras */}
                      <Collapse.Panel
                        header="Informações extras"
                        key="4"
                        extra={
                          accordionsState.bases[index].extraForm && (
                            <CheckCircleOutlined
                              style={{ color: "green", fontSize: 24 }}
                            />
                          )
                        }
                      >
                        <FieldGroup
                          control={bControl.controls.bExtraInfo.value}
                          render={({ get, invalid, disabled }) => {
                            return (
                              <Form
                                onFinish={() => {
                                  console.log(
                                    bControl.controls.bExtraInfo.value.value
                                  );
                                  bControl.controls.bExtraInfo.value.controls.list.setValue(
                                    [
                                      ...bControl.controls.bExtraInfo.value
                                        .controls.list.value,
                                      {
                                        info: bControl.controls.bExtraInfo.value
                                          .controls.info.value,
                                        id: bControl.controls.bExtraInfo.value
                                          .controls.list.value.length,
                                      },
                                    ]
                                  );
                                  bControl.controls.bExtraInfo.value.controls.info.reset();
                                  accordionDispatch({
                                    type: "bases",
                                    index: index,
                                    subType: "extraForm",
                                    value:
                                      bControl.controls.bExtraInfo.value.valid,
                                  });
                                }}
                              >
                                {!disabled && (
                                  <Space size="middle">
                                    <FieldControl
                                      name="info"
                                      meta={{ label: "Informações adicionais" }}
                                      render={(e) => {
                                        return (
                                          <div>
                                            <label htmlFor="transport">
                                              {e.meta.label}
                                            </label>
                                            <Input.TextArea {...e.handler()} />
                                          </div>
                                        );
                                      }}
                                    />
                                    <Button type="primary" htmlType="submit">
                                      Incluir
                                    </Button>
                                  </Space>
                                )}
                                <FieldControl
                                  name="list"
                                  meta={{ label: "Informações Adicionais" }}
                                  render={(e) => {
                                    const { value } = e.handler();
                                    return (
                                      <Table
                                        columns={[
                                          {
                                            title: "Id",
                                            dataIndex: "id",
                                            key: "id",
                                          },
                                          {
                                            title: "Informações Adicionais",
                                            dataIndex: "info",
                                            key: "info",
                                          },
                                        ]}
                                        rowKey="id"
                                        dataSource={value}
                                        pagination={{
                                          position: ["bottomCenter"],
                                          pageSize: 3,
                                          showTotal: (total) => {
                                            return `Total de ${total} itens`;
                                          },
                                        }}
                                        locale={{
                                          emptyText:
                                            "Nenhum registro encontrado",
                                        }}
                                      />
                                    );
                                  }}
                                />
                              </Form>
                            );
                          }}
                        />
                      </Collapse.Panel>
                    </Collapse>
                  </Collapse.Panel>
                </Collapse>
              );
            }
          )}
        </Collapse.Panel>
      </Collapse>
    </div>
  );
}

export default App;
