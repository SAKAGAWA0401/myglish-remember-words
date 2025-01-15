import { sendWordsToServer, fetchWordsFromServer } from '@/services/apiService';
import { useWordList } from "@/hooks/useWordList";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

export default function WordForm() {
  const { setWords } = useWordList(); // WordListContextからsetWordsを取得
  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      english: "",
      japanese: "",
    },
  });

  async function onSubmit(data) {
    const { english, japanese } = data;
    if (!english.trim() || !japanese.trim()) return;

    // バリデーション: 英語140文字以下かつ英語のみ
    if (english.length > 140 || !/^[a-zA-Z\s]+$/.test(english)) {
      alert("English input must be 140 characters or less and contain only alphabets.");
      return;
    }

    // バリデーション: 日本語140文字以下かつ日本語のみ
    if (japanese.length > 140 || !/^[\u3040-\u30FF\u4E00-\u9FFF]+$/.test(japanese)) {
      alert("Japanese input must be 140 characters or less and contain only Japanese characters.");
      return;
    }

    try {
      await sendWordsToServer(english, japanese);
      const updatedWords = await fetchWordsFromServer(); // サーバーから最新リストを取得
      setWords(updatedWords); // 取得したリストを更新      
      reset(); // フォームをリセット
    } catch (err) {
      console.error(err);
      alert(err.message); // エラーメッセージを表示
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <form className="p-4 max-w-md">
        {/* English Field */}
        <FormField
          name="english"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>English:</FormLabel>
              <FormControl>
                <Input {...field} type="text" required />
              </FormControl>
            </FormItem>
          )}
        />
        {/* Japanese Field */}
        <FormField
          name="japanese"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Japanese:</FormLabel>
              <FormControl>
                <Input {...field} type="text" required />
              </FormControl>
            </FormItem>
          )}
        />

        <Button variant="default" type="submit" className="mt-4">
          Save
        </Button>
      </form>
    </Form>
  );
}
