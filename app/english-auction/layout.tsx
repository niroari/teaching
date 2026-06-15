import { GameStateProvider } from "@/app/english-auction/context/GameStateContext";

export default function EnglishAuctionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GameStateProvider>{children}</GameStateProvider>;
}
