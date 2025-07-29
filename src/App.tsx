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
  createTheme,
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

// 創建主題配置
const lightTheme = createTheme({
  // colorScheme: 'light', // 移除已棄用的屬性
});

const darkTheme = createTheme({
  // colorScheme: 'dark', // 移除已棄用的屬性
});

const Version = "0.1.3";
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
}: {
  isDark: boolean;
  toggleTheme: () => void;
  onPreviewClick: () => void;
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
  const [markdown, setMarkdown] = useState<string>("");
  const [html, setHTML] = useState<string>("");
  const [document, setDocument] = useState([]);
  // 添加主題狀態
  const [isDarkMode, setIsDarkMode] = useState(false);
  // 添加預覽模式狀態
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // 主題切換函數
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const { codeBlock, ...remainingBlockSpecs } = defaultBlockSpecs;

  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    // Adds column and column list blocks to the schema, plus Alert block.
    schema: withMultiColumn(
      BlockNoteSchema.create({
        blockSpecs: {
          // Adds all default blocks.
          ...remainingBlockSpecs,
          // Adds the Alert block.
          alert: Alert,
        },
        // This is already the default, but you can add more inline content types here.
        inlineContentSpecs: defaultInlineContentSpecs,
        // This is already the default, but you can add more style types here.
        styleSpecs: defaultStyleSpecs,
      })
    ),
    // The default drop cursor only shows up above and below blocks - we replace
    // it with the multi-column one that also shows up on the sides of blocks.
    dropCursor: multiColumnDropCursor,
    // Merges the default dictionary with the multi-column dictionary.
    dictionary: {
      ...(locales[defaultLanguage] || locales.en),
      multi_column:
        newMultiColumnLocales[defaultLanguage] || multiColumnLocales.en,
    },
    // Load the predefined data from data/index.ts
    initialContent: data as any,
  });
  const previewEditor = useCreateBlockNote();
  // 預覽模式相關函數
  const openPreviewModal = async () => {
    const editorHtml = await editor.blocksToHTMLLossy(editor.document);
    const blocks = await previewEditor.tryParseHTMLToBlocks(editorHtml);
    previewEditor.replaceBlocks(previewEditor.document, blocks);
    setIsPreviewModalOpen(true);
  };
  const closePreviewModal = () => {
    setIsPreviewModalOpen(false);
  };

  // 监听编辑器内容变化
  useEditorChange(async (editor) => {
    // JSON
    setDocument(editor.document as any);
    // Converts the editor's contents from Block objects to HTML and store to state.
    const html = await editor.blocksToHTMLLossy(editor.document);
    setHTML(html);
    // Converts the editor's contents from Block objects to Markdown and store to state.
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

  // Renders the editor instance using a React component.
  return (
    <MantineProvider theme={isDarkMode ? darkTheme : lightTheme}>
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
        />
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
        <div style={{ padding: "20px" }}>
          <BlockNoteView
            editor={editor}
            slashMenu={false}
            formattingToolbar={false}
            sideMenu={false}
            theme={isDarkMode ? "dark" : "light"}
          >
            {/* Custom Side Menu with Alert Type Button */}
            <SideMenuController
              sideMenu={(props) => (
                <SideMenu {...props}>
                  <AlertTypeButton editor={editor} block={props.block} />
                  <AddBlockButton {...props} />
                  <DragHandleButton {...props} />
                </SideMenu>
              )}
            />
            {/* Replaces the default slash menu with one that has both the default
          items and the multi-column ones. */}
            <SuggestionMenuController
              triggerCharacter="/"
              getItems={getSlashMenuItems}
            />
            {/* Replaces the default Formatting Toolbar */}
            <FormattingToolbarController
              formattingToolbar={() => (
                // Uses the default Formatting Toolbar.
                <FormattingToolbar
                  // Sets the items in the Block Type Select.
                  blockTypeSelectItems={[
                    // Gets the default Block Type Select items.
                    ...blockTypeSelectItems(editor.dictionary),
                  ]}
                />
              )}
            />
          </BlockNoteView>

          {/* 文檔內容預覽 */}
          {[
            {
              title: "JSON --變更編輯器後即時更新",
              content: JSON.stringify(document, null, 2),
            },
            { title: "HTML --變更編輯器後即時更新", content: html },
            { title: "Markdown --變更編輯器後即時更新", content: markdown },
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

        {/* 全螢幕預覽模式 Modal */}
        <Modal
          opened={isPreviewModalOpen}
          onClose={closePreviewModal}
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
              height: "calc(100vh - 80px)", // 減去 header 高度
              overflow: "hidden",
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // IE 和 Edge
              "&::WebkitScrollbar": {
                display: "none", // WebKit 瀏覽器
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
      </div>
    </MantineProvider>
  );
}
