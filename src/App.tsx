import {
  BlockNoteSchema,
  combineByGroup,
  filterSuggestionItems,
  defaultBlockSpecs,
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
} from "@blocknote/react";
import {
  getMultiColumnSlashMenuItems,
  multiColumnDropCursor,
  locales as multiColumnLocales,
  withMultiColumn,
} from "@blocknote/xl-multi-column";
import { useMemo, useState } from "react";
import { RiAlertFill } from "react-icons/ri";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { MantineProvider, createTheme, Button, Group, Paper, Title } from "@mantine/core";
import { Alert } from "./Alert";
import "./Alert.css";
import { data } from "./data/index";

// 創建主題配置
const lightTheme = createTheme({
  colorScheme: 'light',
});

const darkTheme = createTheme({
  colorScheme: 'dark',
});

// Header 組件
function Header({ isDark, toggleTheme }: { isDark: boolean; toggleTheme: () => void }) {
  return (
    <Paper 
      shadow="sm" 
      p="md" 
      style={{ 
        borderRadius: 0, 
        borderBottom: `1px solid ${isDark ? '#373A40' : '#E9ECEF'}`,
        backgroundColor: isDark ? '#1A1B1E' : '#FFFFFF'
      }}
    >
      <Group justify="space-between" align="center">
        <Title order={3} style={{ color: isDark ? '#FFFFFF' : '#000000' }}>
          <h1>v 1.0</h1>
        </Title>
        <Button
          variant="outline"
          onClick={toggleTheme}
          leftSection={isDark ? <MdLightMode size={16} /> : <MdDarkMode size={16} />}
          style={{
            borderColor: isDark ? '#373A40' : '#CED4DA',
            color: isDark ? '#FFFFFF' : '#000000'
          }}
        >
          {isDark ? '淺色模式' : '深色模式'}
        </Button>
      </Group>
    </Paper>
  );
}

export default function App() {
  // 添加状态来存储当前文档内容
  const [document, setDocument] = useState(data);
  // 添加主題狀態
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 主題切換函數
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    // Adds column and column list blocks to the schema, plus Alert block.
    schema: withMultiColumn(
      BlockNoteSchema.create({
        blockSpecs: {
          // Adds all default blocks.
          ...defaultBlockSpecs,
          // Adds the Alert block.
          alert: Alert,
        },
      })
    ),
    // The default drop cursor only shows up above and below blocks - we replace
    // it with the multi-column one that also shows up on the sides of blocks.
    dropCursor: multiColumnDropCursor,
    // Merges the default dictionary with the multi-column dictionary.
    dictionary: {
      ...locales.en,
      multi_column: multiColumnLocales.en,
    },
    // Load the predefined data from data/index.ts
    initialContent: data,
  });

  // 监听编辑器内容变化
  useEditorChange((editor) => {
    setDocument(editor.document);
  }, editor);

  // Gets the default slash menu items merged with the multi-column ones.
  const getSlashMenuItems = useMemo(() => {
    return async (query: string) =>
      filterSuggestionItems(
        combineByGroup(
          getDefaultReactSlashMenuItems(editor),
          getMultiColumnSlashMenuItems(editor)
        ),
        query
      );
  }, [editor]);

  // Renders the editor instance using a React component.
  return (
    <MantineProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: isDarkMode ? '#1A1B1E' : '#FFFFFF',
        transition: 'background-color 0.3s ease'
      }}>
        <Header isDark={isDarkMode} toggleTheme={toggleTheme} />
        
        <div style={{ padding: '20px' }}>
          <BlockNoteView
            editor={editor}
            slashMenu={false}
            formattingToolbar={false}
            theme={isDarkMode ? 'dark' : 'light'}
          >
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
                    // Adds an item for the Alert block.
                    {
                      name: "Alert",
                      type: "alert",
                      icon: RiAlertFill,
                      isSelected: (block) => block.type === "alert",
                    },
                  ]}
                />
              )}
            />
          </BlockNoteView>
          
          {/* 文檔內容預覽 */}
          <Paper 
            mt="xl" 
            p="md" 
            style={{ 
              backgroundColor: isDarkMode ? '#25262B' : '#F8F9FA',
              border: `1px solid ${isDarkMode ? '#373A40' : '#E9ECEF'}`
            }}
          >
            <Title order={4} mb="md" style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}>
              文檔內容 (JSON)
            </Title>
            <pre style={{ 
              color: isDarkMode ? '#C1C2C5' : '#495057',
              fontSize: '12px',
              overflow: 'auto',
              maxHeight: '300px'
            }}>
              {JSON.stringify(document, null, 2)}
            </pre>
          </Paper>
        </div>
      </div>
    </MantineProvider>
  );
}
