export const AnalyticsEvents = {
  // System & Lifecycle
  APP_STARTED: "app_started",
  PAGE_VIEWED: "page_viewed",
  ROUTE_CHANGED: "route_changed",
  WEB_VITALS_CAPTURED: "web_vitals_captured",
  UNHANDLED_ERROR: "unhandled_error",
  UNHANDLED_REJECTION: "unhandled_rejection",

  // Repository Events
  REPOSITORY_SEARCH: "repository_search",
  REPOSITORY_VIEWED: "repository_viewed",
  REPOSITORY_HEALTH_VIEWED: "repository_health_viewed",
  REPOSITORY_INTELLIGENCE_VIEWED: "repository_intelligence_viewed",
  KNOWLEDGE_GRAPH_VIEWED: "knowledge_graph_viewed",
  ARCHITECTURE_VIEWED: "architecture_viewed",
  DEPENDENCIES_VIEWED: "dependencies_viewed",
  JOURNEY_VIEWED: "journey_viewed",
  REPOSITORY_DETAILS_EXPANDED: "repository_details_expanded",

  // Issue & Recommendation Events
  ISSUE_VIEWED: "issue_viewed",
  ISSUE_SEARCH: "issue_search",
  CONTRIBUTION_ESTIMATE_VIEWED: "contribution_estimate_viewed",
  RECOMMENDATION_SHOWN: "recommendation_shown",
  RECOMMENDATION_CLICKED: "recommendation_clicked",
  RECOMMENDATION_IGNORED: "recommendation_ignored",
  RECOMMENDATION_EXPANDED: "recommendation_expanded",
  ISSUE_STARTED: "issue_started",

  // AI & Mentor Events
  AI_SUMMARY_GENERATED: "ai_summary_generated",
  AI_CONTRIBUTION_PLAN_GENERATED: "ai_contribution_plan_generated",
  AI_REPOSITORY_SUMMARY_GENERATED: "ai_repository_summary_generated",
  AI_CONCEPT_EXTRACTION_GENERATED: "ai_concept_extraction_generated",
  AI_COMPLEXITY_ANALYSIS_GENERATED: "ai_complexity_analysis_generated",
  AI_LEARNING_PATH_GENERATED: "ai_learning_path_generated",
  MENTOR_SESSION_STARTED: "mentor_session_started",
  MENTOR_READING_ORDER_VIEWED: "mentor_reading_order_viewed",
  MENTOR_STRATEGY_VIEWED: "mentor_strategy_viewed",
  MENTOR_CHECKLIST_VIEWED: "mentor_checklist_viewed",
  MENTOR_DEBUGGING_VIEWED: "mentor_debugging_viewed",
} as const;

export type AnalyticsEventType = (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];
