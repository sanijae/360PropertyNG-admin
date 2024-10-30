import { PageContainer, AgentDetails } from "components";
import { Stack } from "@mui/material";
import { RootState, AppDispatch } from "lib/store";
import { fetchUsers } from "lib/features/users/userSlices";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

interface Posts{
  posts: object[];
}

interface Agents {
  id: string;
  _id: string;
  name: string;
  email: string;
  address: string;
  imageUrl: string;
  title: string;
  phone: number;
  posts:Posts[];
  isVerified: boolean;
}

export default function Agent() {
  const {users}  =  useSelector((state: RootState) => state.users)
  const dispatch: AppDispatch = useDispatch();
  const [agents, setAgents] = useState<Agents[]>([])

  useEffect(()=>{
    window.document.title = "360PropertyNG - Agents"
  },[])

  useEffect(()=>{
    dispatch(fetchUsers());
    window.document.title = "360PropertyNG - Agents"
  },[dispatch])

  useEffect(() => {
    const verifiedAgents = users.filter((user) => user.isVerified);
    setAgents(verifiedAgents);
  }, [users]);
  // console.log(agents);
  
  return (
    <PageContainer title="Agents List">
      <Stack spacing="1.5rem">
        {agents.map((agent: Agents, index: any) => (
          <AgentDetails 
          key={`agent-${index}`}
          image={undefined} 
          name={agent.name}
          phone={agent.phone} 
          address={agent.address} 
          posts={agent.posts} 
          email={agent.email}
          role = {agent.title}
          id={agent._id}
          />
        ))}
      </Stack>
    </PageContainer>
  );
}
