import { Crown, Mail, MoreHorizontal, ShieldCheck, Users } from "lucide-react";
import { useState } from "react";
import teamData from "../../mocks/team.json";
import type { TeamMember } from "../../types";
import { Button, Card, Dropdown, Toggle, cn } from "../../components/ui";

export function TeamPage() {
  const [members, setMembers] = useState(teamData as TeamMember[]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Editor");
  const [permissions, setPermissions] = useState<Record<string, boolean>>({
    upload: true,
    edit: true,
    export: true,
    billing: false,
  });
  const roleLabel = {
    Owner: "Proprietário",
    Editor: "Editor",
    Viewer: "Visualizador",
  };
  const statusLabel = { Active: "Ativo", Pending: "Pendente" };
  const permissionLabel: Record<string, string> = {
    upload: "Enviar",
    edit: "Editar",
    export: "Exportar",
    billing: "Cobrança",
  };
  const invite = () => {
    if (!email.trim()) return;
    setMembers([
      ...members,
      {
        id: Date.now(),
        name: email.split("@")[0],
        email,
        role: role === "Visualizador" ? "Viewer" : "Editor",
        status: "Pending",
        initials: email.slice(0, 2).toUpperCase(),
        color: "#00E5FF",
      },
    ]);
    setEmail("");
  };
  return (
    <div className="mx-auto max-w-[1400px] p-8">
      <div>
        <p className="label mb-2">Configurações do espaço</p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Equipe e permissões
        </h1>
        <p className="mt-2 text-sm text-textMuted">
          Reúna sua equipe criativa e mantenha tudo sob controle.
        </p>
      </div>
      <div className="mt-8 grid grid-cols-[1fr_350px] gap-6">
        <div className="space-y-6">
          <Card className="p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Convidar alguém</h2>
                <p className="mt-1 text-xs text-textMuted">
                  A pessoa receberá um convite por e-mail.
                </p>
              </div>
              <Mail size={20} className="text-cyan" />
            </div>
            <div className="flex gap-3">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@empresa.com"
                className="interactive h-10 flex-1 rounded-lg border border-border bg-white/[0.03] px-3 text-sm focus:border-cyan/50 focus:shadow-glow focus:outline-none"
              />
              <Dropdown
                value={role}
                options={["Editor", "Visualizador"]}
                onChange={setRole}
                className="w-36"
              />
              <Button onClick={invite}>Enviar convite</Button>
            </div>
          </Card>
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-border p-5">
              <div>
                <h2 className="font-semibold">Membros</h2>
                <p className="mt-1 text-xs text-textMuted">
                  {members.length} pessoas neste espaço
                </p>
              </div>
              <Users size={20} className="text-textMuted" />
            </div>
            <table className="w-full text-left">
              <thead className="border-b border-border text-[10px] uppercase tracking-wider text-textMuted">
                <tr>
                  <th className="px-5 py-3 font-medium">Membro</th>
                  <th className="px-5 py-3 font-medium">Função</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr
                    key={member.id}
                    className="border-b border-border last:border-0 hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          style={{
                            backgroundColor: `${member.color}25`,
                            color: member.color,
                          }}
                          className="grid size-9 place-items-center rounded-full text-xs font-bold"
                        >
                          {member.initials}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="mt-0.5 text-xs text-textMuted">
                            {member.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs">
                      <span className="inline-flex items-center gap-1.5">
                        {member.role === "Owner" && (
                          <Crown size={13} className="text-amber-300" />
                        )}
                        {roleLabel[member.role]}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          "rounded-full px-2 py-1 text-[10px]",
                          member.status === "Active"
                            ? "bg-emerald-400/10 text-emerald-300"
                            : "bg-amber-400/10 text-amber-300",
                        )}
                      >
                        {statusLabel[member.status]}
                      </span>
                    </td>
                    <td className="px-5">
                      <MoreHorizontal size={17} className="text-textMuted" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
          <Card className="p-5">
            <div className="mb-5">
              <h2 className="font-semibold">Permissões por função</h2>
              <p className="mt-1 text-xs text-textMuted">
                Defina o que os editores podem acessar no espaço de trabalho.
              </p>
            </div>
            <div className="grid grid-cols-4 divide-x divide-border rounded-xl border border-border">
              {Object.entries(permissions).map(([key, value]) => (
                <div className="flex flex-col items-center gap-3 p-4" key={key}>
                  <span className="text-xs">{permissionLabel[key]}</span>
                  <Toggle
                    checked={value}
                    onChange={(checked) =>
                      setPermissions({ ...permissions, [key]: checked })
                    }
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div>
          <Card className="sticky top-28 overflow-hidden">
            <div className="bg-gradient-to-br from-cyan/15 to-electric/5 p-6">
              <div className="mb-5 grid size-11 place-items-center rounded-xl bg-cyan text-midnight shadow-glow">
                <ShieldCheck size={22} />
              </div>
              <p className="label">Plano atual</p>
              <div className="mt-2 flex items-end gap-2">
                <h2 className="text-3xl font-semibold">Studio</h2>
                <span className="mb-1 text-sm text-textMuted">US$ 79/mês</span>
              </div>
            </div>
            <div className="space-y-5 p-6">
              <div>
                <div className="mb-2 flex justify-between text-xs">
                  <span>Vagas da equipe</span>
                  <span className="text-textMuted">4 / 8</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10">
                  <div className="h-full w-1/2 rounded-full bg-cyan" />
                </div>
              </div>
              <div>
                <div className="mb-2 flex justify-between text-xs">
                  <span>Processamento por IA</span>
                  <span className="text-textMuted">312 / 600 min</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10">
                  <div className="h-full w-[52%] rounded-full bg-electric" />
                </div>
              </div>
              <Button variant="ghost" className="w-full">
                Gerenciar cobrança
              </Button>
              <p className="text-center text-[10px] text-textMuted">
                Próxima fatura em 4 de setembro
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
