import { Menu, Group, Box } from "@mantine/core";
import { useComponentsContext } from "@blocknote/react";
import { alertTypes } from "./AlertOk";
import type { BlockNoteEditor, Block } from "@blocknote/core";

interface AlertTypeButtonProps {
  editor: BlockNoteEditor<any>;
  block: Block<any>;
}

export function AlertTypeButton({ editor, block }: AlertTypeButtonProps) {
  const Components = useComponentsContext()!;

  // Only show this button for alert blocks
  if (block.type !== "alert") {
    return null;
  }

  const currentAlertType = alertTypes.find(
    (type) => type.value === block.props.type
  );

  const CurrentIcon = currentAlertType?.icon;

  return (
    <Menu withinPortal={false} position="right" offset={5}>
      <Menu.Target>
        <Components.SideMenu.Button
          className="bn-button c-no-padding"
          data-test="alert-type-button"
        >
          {CurrentIcon && (
            <CurrentIcon
              size={16}
              style={{
                color: currentAlertType?.color,
              }}
            />
          )}
        </Components.SideMenu.Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Box p="xs">
          <div
            style={{
              fontSize: "12px",
              fontWeight: 600,
              marginBottom: "8px",
              color: "var(--mantine-color-dimmed)",
            }}
          >
            Alert Type
          </div>
          <Group gap="2px" wrap="nowrap">
            {alertTypes.map((type) => {
              const ItemIcon = type.icon;
              const isSelected = type.value === block.props.type;
              return (
                <Box
                  key={type.value}
                  onClick={() => {
                    editor.updateBlock(block, {
                      type: "alert",
                      props: { type: type.value },
                    });
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "28px",
                    height: "28px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    backgroundColor: isSelected
                      ? "var(--mantine-color-blue-light)"
                      : "transparent",
                    border: isSelected
                      ? "1px solid var(--mantine-color-blue-filled)"
                      : "1px solid transparent",
                    transition: "all 0.15s ease",
                  }}
                  title={type.title}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor =
                        "var(--mantine-color-gray-light)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <ItemIcon
                    size={14}
                    style={{
                      color: type.color,
                    }}
                  />
                </Box>
              );
            })}
          </Group>
        </Box>
      </Menu.Dropdown>
    </Menu>
  );
}
