import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TeamMemberCard from '@/components/TeamMemberCard';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { useProjects } from '@/hooks/useProjects';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Plus, Users } from 'lucide-react';

const TeamManagementPage = () => {
  const { teamMembers, loading, addTeamMember, removeTeamMember } = useTeamMembers();
  const { projects } = useProjects();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    projectId: '',
    role: 'member'
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.userId || !formData.projectId) {
      toast.error('User ID and project are required');
      return;
    }

    setSubmitting(true);
    try {
      await addTeamMember(formData);
      toast.success('Team member added successfully');
      setDialogOpen(false);
      setFormData({ userId: '', projectId: '', role: 'member' });
    } catch (err) {
      toast.error('Failed to add team member');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm('Remove this team member?')) {
      return;
    }

    try {
      await removeTeamMember(id);
      toast.success('Team member removed');
    } catch (err) {
      toast.error('Failed to remove team member');
    }
  };

  return (
    <>
      <Helmet>
        <title>Team management - TaskFlow</title>
        <meta name="description" content="Manage your team members and their roles across projects." />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1 py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2" style={{letterSpacing: '-0.02em'}}>
                  Team management
                </h1>
                <p className="text-muted-foreground">Manage team members across all projects</p>
              </div>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add team member</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="userId" className="form-label">User ID</Label>
                      <Input
                        id="userId"
                        value={formData.userId}
                        onChange={(e) => setFormData(prev => ({ ...prev, userId: e.target.value }))}
                        placeholder="Enter user ID"
                        className="form-input"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="projectId" className="form-label">Project</Label>
                      <Select
                        value={formData.projectId}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, projectId: value }))}
                      >
                        <SelectTrigger id="projectId" className="form-input">
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects.map(project => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="role" className="form-label">Role</Label>
                      <Select
                        value={formData.role}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                      >
                        <SelectTrigger id="role" className="form-input">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-3 justify-end">
                      <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={submitting}>
                        {submitting ? 'Adding...' : 'Add member'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Skeleton key={i} className="h-20" />
                ))}
              </div>
            ) : teamMembers.length === 0 ? (
              <div className="text-center py-16 bg-card border border-border rounded-2xl">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No team members yet</h3>
                <p className="text-muted-foreground mb-6">Add team members to start collaborating</p>
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add member
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teamMembers.map(member => (
                  <TeamMemberCard
                    key={member.id}
                    member={member}
                    onRemove={handleRemove}
                    canRemove={true}
                  />
                ))}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default TeamManagementPage;
