import { useData } from '@/context';
import emojis from 'emojibase-data/en/data.json';

const EMOJI_GROUPS: Record<number, string> = {
  0: "Smileys & Emotion",
  1: "People & Body",
  3: "Animals & Nature",
  4: "Food & Drink",
  5: "Travel & Places",
  6: "Activities",
  7: "Objects",
  8: "Symbols",
};

type GroupedEmoji = {
  groupName: string;
  emojis: string[];
};

// Faqat yaroqli emojilarni qo‘shamiz
const isValidEmoji = (emoji: string): boolean => {
  return !emoji.includes("🫩"); // noto‘g‘ri (to‘rtburchak) emoji
};

const groupedEmojiArray: GroupedEmoji[] = Object.entries(
  emojis.reduce((acc: Record<string, string[]>, emoji) => {
    const group = emoji.group as number;
    if (group === 2 || group === 9 || !(group in EMOJI_GROUPS)) return acc;

    const groupName = EMOJI_GROUPS[group];
    if (!acc[groupName]) acc[groupName] = [];

    if (isValidEmoji(emoji.emoji)) {
      acc[groupName].push(emoji.emoji);
    }

    return acc;
  }, {})
).map(([groupName, emojis]) => ({
  groupName,
  emojis,
}));

export const EmojiDatas = () => {
  const { setEmojiSelect} = useData()

  return (
    <div className=' overflow-y-scroll overflow-x-hidden h-[100vh] py-4 px-3 space-y-4 '>
      {groupedEmojiArray.map((item, index) => (
        <div key={index}>
          <p className='font-bold text-lg mb-1'>{item.groupName}</p>
          <div className='text-xl flex flex-wrap gap-1 justify-around'>
            {item.emojis.map((emoji, i) => (
              <button
                key={i}
                className='hover:bg-gray-200 rounded p-1'
                onClick={() => setEmojiSelect(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
