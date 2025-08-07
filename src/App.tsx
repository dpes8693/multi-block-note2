import { useEffect } from "react";
import {
  BlockNoteSchema,
  combineByGroup,
  filterSuggestionItems,
  defaultBlockSpecs,
  defaultInlineContentSpecs,
  defaultStyleSpecs,
  // BlockNoteEditor,
  insertOrUpdateBlock,
} from "@blocknote/core";
import * as locales from "@blocknote/core/locales";
import "@blocknote/core/fonts/inter.css";

import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import "./prototype/css/style.css";
import "./prototype/css/styles.css";
import "./prototype/css/layout.css";

import {
  SuggestionMenuController,
  getDefaultReactSlashMenuItems,
  useCreateBlockNote,
  useEditorChange,
  FormattingToolbarController,
  blockTypeSelectItems,
  FormattingToolbar,
  SideMenuController,
  SideMenu,
  DragHandleButton,
  AddBlockButton,
} from "@blocknote/react";
import {
  getMultiColumnSlashMenuItems,
  multiColumnDropCursor,
  locales as multiColumnLocales,
  withMultiColumn,
} from "@blocknote/xl-multi-column";
import { useMemo, useState } from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import {
  MantineProvider,
  Button,
  Group,
  Paper,
  Title,
  Modal,
} from "@mantine/core";
import { Alert } from "./AlertOk";
import { AlertTypeButton } from "./AlertTypeButton";
import "./Alert.css";
import { data } from "./data/index";
import { HiOutlineGlobeAlt } from "react-icons/hi";
import { codeBlock } from "@blocknote/code-block";

const Version = "0.1.8";
const defaultLanguage = "zhTW";

const newMultiColumnLocales = {
  ...multiColumnLocales,
  zhTW: {
    slash_menu: {
      two_columns: {
        title: "兩列",
        subtext: "兩列並排",
        aliases: ["列", "行", "分割"],
        group: "基礎",
      },
      three_columns: {
        title: "三列",
        subtext: "三列並排",
        aliases: ["列", "行", "分割"],
        group: "基礎",
      },
    },
  },
};

// Header 組件
function Header({
  isDark,
  toggleTheme,
  onPreviewClick,
  handleExportJSON,
  handleImportJSON,
}: {
  isDark: boolean;
  toggleTheme: () => void;
  onPreviewClick: () => void;
  handleExportJSON: () => void;
  handleImportJSON: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <Paper
      shadow="sm"
      p="md"
      style={{
        borderRadius: 0,
        borderBottom: `1px solid ${isDark ? "#373A40" : "#E9ECEF"}`,
        backgroundColor: isDark ? "#1A1B1E" : "#FFFFFF",
      }}
    >
      <Group justify="space-between" align="center">
        <Title order={3} style={{ color: isDark ? "#FFFFFF" : "#000000" }}>
          {`v ${Version}`}
        </Title>
        <Group>
          <Button
            variant="filled"
            onClick={onPreviewClick}
            style={{
              backgroundColor: isDark ? "#228BE6" : "#228BE6",
              color: "#FFFFFF",
            }}
          >
            HTML 預覽
          </Button>
          {/* 匯出 JSON 按鈕 */}
          <Button
            variant="outline"
            onClick={handleExportJSON}
            style={{
              borderColor: isDark ? "#373A40" : "#CED4DA",
              color: isDark ? "#FFFFFF" : "#000000",
            }}
          >
            匯出 JSON
          </Button>
          {/* 匯入 JSON 按鈕與隱藏 input */}
          <Button
            variant="outline"
            onClick={() => {
              const input = window.document.getElementById("import-json-input");
              if (input) (input as HTMLInputElement).click();
            }}
            style={{
              borderColor: isDark ? "#373A40" : "#CED4DA",
              color: isDark ? "#FFFFFF" : "#000000",
            }}
          >
            匯入 JSON
          </Button>
          <input
            id="import-json-input"
            type="file"
            accept="application/json"
            style={{ display: "none" }}
            onChange={handleImportJSON}
          />
          <Button
            variant="outline"
            onClick={toggleTheme}
            leftSection={
              isDark ? <MdLightMode size={16} /> : <MdDarkMode size={16} />
            }
            style={{
              borderColor: isDark ? "#373A40" : "#CED4DA",
              color: isDark ? "#FFFFFF" : "#000000",
            }}
          >
            {isDark ? "淺色模式" : "深色模式"}
          </Button>
        </Group>
      </Group>
    </Paper>
  );
}

export default function App() {
  // editor 設定
  const { ...remainingBlockSpecs } = defaultBlockSpecs;
  const blockNoteSchema = withMultiColumn(
    BlockNoteSchema.create({
      blockSpecs: {
        ...remainingBlockSpecs,
        alert: Alert,
      },
      inlineContentSpecs: defaultInlineContentSpecs,
      styleSpecs: defaultStyleSpecs,
    })
  );
  const dropCursor = multiColumnDropCursor;
  const dictionary = {
    ...(locales[defaultLanguage] || locales.en),
    multi_column:
      newMultiColumnLocales[defaultLanguage] || multiColumnLocales.en,
  };

  // 預覽 Modal 子元件
  function PreviewModal({
    opened,
    onClose,
    html,
    isDarkMode,
  }: {
    opened: boolean;
    onClose: () => void;
    html: string;
    isDarkMode: boolean;
  }) {
    const previewEditor = useCreateBlockNote({
      codeBlock,
      schema: blockNoteSchema,
      dropCursor,
      dictionary,
      initialContent: [
        {
          type: "paragraph",
          content: [],
        },
      ],
    });
    useEffect(() => {
      async function syncBlocks() {
        const blocks = await previewEditor.tryParseHTMLToBlocks(html);
        previewEditor.replaceBlocks(previewEditor.document, blocks);
      }
      if (opened) {
        syncBlocks();
      }
    }, [html, opened]);
    return (
      <Modal
        opened={opened}
        onClose={onClose}
        title="預覽"
        fullScreen
        styles={{
          header: {
            backgroundColor: isDarkMode ? "#1A1B1E" : "#FFFFFF",
            borderBottom: `1px solid ${isDarkMode ? "#373A40" : "#E9ECEF"}`,
          },
          title: {
            color: isDarkMode ? "#FFFFFF" : "#000000",
            fontWeight: 600,
          },
          content: {
            backgroundColor: isDarkMode ? "#1A1B1E" : "#FFFFFF",
          },
          body: {
            height: "calc(100vh - 80px)",
            overflow: "hidden",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "&::WebkitScrollbar": {
              display: "none",
            },
          },
          close: {
            color: isDarkMode ? "#FFFFFF" : "#000000",
            "&:hover": {
              backgroundColor: isDarkMode ? "#373A40" : "#F1F3F4",
            },
          },
        }}
      >
        <div style={{ height: "100%" }}>
          <Paper
            p="md"
            style={{
              backgroundColor: isDarkMode ? "#25262B" : "#F8F9FA",
              border: `1px solid ${isDarkMode ? "#373A40" : "#E9ECEF"}`,
              height: "100%",
              overflow: "auto",
            }}
          >
            <BlockNoteView
              editor={previewEditor}
              theme={isDarkMode ? "dark" : "light"}
              editable={false}
            />
          </Paper>
        </div>
      </Modal>
    );
  }
  const [markdown, setMarkdown] = useState<string>("");
  const [html, setHTML] = useState<string>("");
  const [docBlocks, setDocBlocks] = useState([]);
  // 添加主題狀態
  const [isDarkMode, setIsDarkMode] = useState(false);
  // 添加預覽模式狀態
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // 主題切換函數
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Creates a new editor instance。
  const editor = useCreateBlockNote({
    codeBlock,
    schema: blockNoteSchema,
    dropCursor,
    dictionary,
    initialContent: data as any,
  });
  // 預覽模式相關函數
  const [previewHtml, setPreviewHtml] = useState("");
  const openPreviewModal = async () => {
    const editorHtml = await editor.blocksToFullHTML(editor.document);
    setPreviewHtml(editorHtml);
    setIsPreviewModalOpen(true);
  };
  const closePreviewModal = () => {
    setIsPreviewModalOpen(false);
    setPreviewHtml("");
  };

  // 监听编辑器内容变化
  useEditorChange(async (editor) => {
    setDocBlocks(editor.document as any);
    const html = await editor.blocksToFullHTML(editor.document);
    setHTML(html);
    const markdown = await editor.blocksToMarkdownLossy(editor.document);
    setMarkdown(markdown);
  }, editor);

  // 新增alert區塊
  const insertAlertItem = (editor: any) => ({
    title: "提示",
    subtext: "Alert區塊",
    onItemClick: () =>
      insertOrUpdateBlock(editor, {
        type: "alert",
        content: [{ type: "text", text: "alert" }],
      } as any),
    aliases: [
      "alert",
      "notification",
      "emphasize",
      "warning",
      "error",
      "info",
      "success",
    ],
    group: "Other",
    icon: <HiOutlineGlobeAlt size={18} />,
  });

  // Gets the default slash menu items merged with the multi-column ones.
  const getSlashMenuItems = useMemo(() => {
    const items = [
      ...combineByGroup(
        getDefaultReactSlashMenuItems(editor),
        getMultiColumnSlashMenuItems(editor)
      ),
      insertAlertItem(editor) as any,
    ];
    // console.log(items);

    return async (query: string) => filterSuggestionItems(items, query);
  }, [editor]);

  // 匯出 JSON
  const handleExportJSON = () => {
    setTimeout(() => {
      const jsonStr = JSON.stringify(editor.document, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = window.document.createElement("a");
      a.href = url;
      a.download = "blocknote.json";
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 50);
  };

  // 匯入 JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          editor.replaceBlocks(editor.document, json);
        } else {
          alert("JSON 格式錯誤，請確認為區塊陣列！");
        }
      } catch {
        alert("無法解析 JSON 檔案！");
      }
      e.target.value = "";
    };
    reader.readAsText(file);
  };

  return (
    <MantineProvider>
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: isDarkMode ? "#1A1B1E" : "#FFFFFF",
          transition: "background-color 0.3s ease",
        }}
      >
        <Header
          isDark={isDarkMode}
          toggleTheme={toggleTheme}
          onPreviewClick={openPreviewModal}
          handleExportJSON={handleExportJSON}
          handleImportJSON={handleImportJSON}
        />
        {/* ...existing code... */}
        <div
          onClick={() => {
            console.log(...blockTypeSelectItems(editor.dictionary));
            console.log("defaultInlineContentSpecs", defaultInlineContentSpecs);
            console.log("defaultStyleSpecs", defaultStyleSpecs);
            console.log("multiColumnLocales", multiColumnLocales);
            console.log("defaultBlockSpecs", defaultBlockSpecs);
          }}
        >
          console.log
        </div>
        {/* ...existing code... */}
        <div style={{ padding: "20px" }}>
          <BlockNoteView
            editor={editor}
            slashMenu={false}
            formattingToolbar={false}
            sideMenu={false}
            theme={isDarkMode ? "dark" : "light"}
          >
            {/* ...existing code... */}
            <SideMenuController
              sideMenu={(props) => (
                <SideMenu {...props}>
                  <AlertTypeButton editor={editor} block={props.block} />
                  <AddBlockButton {...props} />
                  <DragHandleButton {...props} />
                </SideMenu>
              )}
            />
            <SuggestionMenuController
              triggerCharacter="/"
              getItems={getSlashMenuItems}
            />
            <FormattingToolbarController
              formattingToolbar={() => (
                <FormattingToolbar
                  blockTypeSelectItems={[
                    ...blockTypeSelectItems(editor.dictionary),
                  ]}
                />
              )}
            />
          </BlockNoteView>

          {/* ...existing code... */}
          {[
            {
              title: "JSON --變更編輯器後即時更新",
              content: JSON.stringify(docBlocks, null, 2),
            },
            { title: "HTML --變更編輯器後即時更新", content: html },
            {
              title: "Markdown(Lossy) --變更編輯器後即時更新",
              content: markdown,
            },
          ].map((item, index) => (
            <Paper
              key={index}
              mt="xl"
              p="md"
              style={{
                backgroundColor: isDarkMode ? "#25262B" : "#F8F9FA",
                border: `1px solid ${isDarkMode ? "#373A40" : "#E9ECEF"}`,
              }}
            >
              <Title
                order={4}
                mb="md"
                style={{ color: isDarkMode ? "#FFFFFF" : "#000000" }}
              >
                {item.title}
              </Title>
              <pre
                style={{
                  color: isDarkMode ? "#C1C2C5" : "#495057",
                  fontSize: "12px",
                  overflow: "auto",
                  maxHeight: "300px",
                }}
              >
                <code>{item.content}</code>
              </pre>
            </Paper>
          ))}
        </div>

        {/* ...existing code... */}
        <PreviewModal
          opened={isPreviewModalOpen}
          onClose={closePreviewModal}
          html={previewHtml}
          isDarkMode={isDarkMode}
        />
      </div>
    </MantineProvider>
  );
}
