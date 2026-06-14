import { Action, ActionPanel, List, open, showToast, Toast } from "@raycast/api";
import { useEffect, useMemo, useState } from "react";
import { readFile } from "fs/promises";
import { homedir } from "os";
import { join } from "path";

type SearchItem = {
  name: string;
  description: string;
  clk_url: string;
};

const SEARCH_FILE_PATH = join(homedir(), ".config", "raycast", "lewis_extensions_etc", "slink.json");

function isValidUrl(value: string) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function parseSearchItems(value: unknown): SearchItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is SearchItem => {
    if (!item || typeof item !== "object") {
      return false;
    }

    const candidate = item as Record<string, unknown>;

    return (
      typeof candidate.name === "string" &&
      candidate.name.trim().length > 0 &&
      typeof candidate.description === "string" &&
      candidate.description.trim().length > 0 &&
      typeof candidate.clk_url === "string" &&
      isValidUrl(candidate.clk_url)
    );
  });
}

function useSearchItems() {
  const [items, setItems] = useState<SearchItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    async function loadSearchItems() {
      try {
        const content = await readFile(SEARCH_FILE_PATH, "utf8");
        setItems(parseSearchItems(JSON.parse(content)));
      } catch (error) {
        if (error instanceof Error && "code" in error && error.code === "ENOENT") {
          setItems([]);
          return;
        }

        setError(error instanceof Error ? error.message : "读取搜索数据失败");
        await showToast({ style: Toast.Style.Failure, title: "读取搜索数据失败" });
      } finally {
        setIsLoading(false);
      }
    }

    loadSearchItems();
  }, []);

  return { items, isLoading, error };
}

export default function Command() {
  const { items, isLoading, error } = useSearchItems();
  const [searchText, setSearchText] = useState("");

  const results = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    return items.filter((item) => item.name.toLowerCase().includes(keyword));
  }, [items, searchText]);

  return (
    <List isLoading={isLoading} onSearchTextChange={setSearchText} searchBarPlaceholder="输入关键词搜索" throttle>
      {error ? (
        <List.EmptyView title="读取搜索数据失败" description={error} />
      ) : results.length === 0 ? (
        <List.EmptyView title="暂无搜索结果" />
      ) : (
        results.map((item) => (
          <List.Item
            key={item.clk_url}
            title={item.name}
            subtitle={item.description}
            actions={
              <ActionPanel>
                <Action title="打开链接" onAction={() => open(item.clk_url)} />
              </ActionPanel>
            }
          />
        ))
      )}
    </List>
  );
}
