package com.mythovac.backend.service;

import com.mythovac.backend.entity.ScoresRelease;

import java.util.List;

public interface ScoresReleaseService {

    List<ScoresRelease> getAllScoresRelease();
    List<ScoresRelease> getScoresReleaseByUid(Long uid);
    List<ScoresRelease> getScoresReleaseBySid(Long sid);
    void insertScoresRelease(ScoresRelease scoresRelease);
    void deleteScoresRelease(ScoresRelease scoresRelease);

}
