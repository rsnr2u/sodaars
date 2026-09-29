<?php

namespace App\Notifications;

use App\Models\OrganizationInvitation;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class StaffInvitationNotification extends Notification
{
    use Queueable;

    protected OrganizationInvitation $invitation;
    protected string $plainToken;

    public function __construct(OrganizationInvitation $invitation, string $plainToken)
    {
        $this->invitation = $invitation;
        $this->plainToken = $plainToken;
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $orgName = $this->invitation->organization->name;
        $frontendUrl = env('FRONTEND_PROVIDER_URL', 'http://localhost:5173');
        $acceptUrl = "{$frontendUrl}/invitations/accept?token={$this->plainToken}";

        return (new MailMessage)
            ->subject("Invitation to join {$orgName} on SODAARS")
            ->greeting("Hello {$this->invitation->name},")
            ->line("You have been invited to join **{$orgName}** on SODAARS as a **{$this->invitation->role}**.")
            ->line("This invitation is valid until {$this->invitation->expires_at->toFormattedDateString()}.")
            ->action('Accept Invitation', $acceptUrl)
            ->line('If you did not expect this invitation, no action is required.');
    }
}
