package com.noteshared.models.requests;

import lombok.Data;

@Data
public class AcceptOrDeclineSharedNote {
    private int noteTextID;
    private int notificationID;
}
