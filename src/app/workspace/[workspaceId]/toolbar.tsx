"use client";

import { Info, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { InDevelopmentHint } from "@/components/in-development-hint";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Id } from "../../../../convex/_generated/dataModel";

export const Toolbar = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const { data: workspace } = useGetWorkspace({ id: workspaceId });
  const getChannels = useGetChannels({ workspaceId });
  const getMembers = useGetMembers({ workspaceId });

  const [open, setOpen] = useState(false);

  const handleChannelClick = (channelId: Id<"channels">) => () => {
    setOpen(false);
    router.push(`/workspace/${workspaceId}/channel/${channelId}`);
  };

  const handleMemberClick = (memberId: Id<"members">) => () => {
    setOpen(false);
    router.push(`/workspace/${workspaceId}/member/${memberId}`);
  };

  return (
    <div className="bg-[#006c75] flex items-center justify-between h-10 p-1.5">
      <div className="flex-1"></div>
      <div className="min-w-[280px] max-[642px] grow-[2] shrink ">
        <Button
          size="sm"
          className="bg-accent/25 hover:bg-accent-25 w-full justify-start h-7 px-2"
          onClick={() => setOpen(true)}
        >
          <Search className="size-4 text-white mr-2" />
          <span className="text-white text-xs">Search {workspace?.name}</span>
        </Button>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <div className="bg-gray-200 p-4 rounded-md">
            <CommandInput
              placeholder="Type a command or search..."
              className="text-white"
            />
          <CommandList className="text-black">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Channels" >
              {getChannels.data?.map((channel) => (
                <CommandItem
                  key={channel._id}
                  onSelect={handleChannelClick(channel._id)}
                >
                  {channel.name}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Members">
              {getMembers.data?.map((member) => (
                <CommandItem
                  key={member._id}
                  onSelect={handleMemberClick(member._id)}
                >
                  {member.user.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          </div>
        </CommandDialog>
      </div>
      <div className="ml-auto flex-1 flex items-center justify-end">
        {/* TODO: Implement info button */}
        <InDevelopmentHint>
          <Button variant="transparent" size="iconSm" disabled>
            <Info className="size-5 text-white" />
          </Button>
        </InDevelopmentHint>
      </div>
    </div>
  );
};