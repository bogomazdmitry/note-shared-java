package com.noteshared.domain.entities.notifications;

import com.noteshared.domain.entities.users.User;
import lombok.Data;

import javax.persistence.*;
import java.sql.Date;

@Data
@Entity
@Table
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String content;

    private NotificationType type;

    @ManyToOne
    private User user;

    private Date createDateTime;
}
